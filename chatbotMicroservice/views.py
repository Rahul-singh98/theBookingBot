from django.views import View
from django.http import JsonResponse
from .forms import ChatbotConfigurationForm, QuestionForm
from .models import (
    ChatbotConfiguration, Question,
    ChatSession, ChatHistory,
    ChatbotSubmitConfiguration,
    QuestionOption
)
from .utils import QuestionTypes
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import CreateView, UpdateView, ListView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404
from typing import Any
from django.http.response import HttpResponse as HttpResponse
from django.views.generic import TemplateView
import uuid
import json
from django.views.decorators.clickjacking import xframe_options_exempt
from django.utils.decorators import method_decorator


class ChatBot(TemplateView):
    template_name = "chatbot.html"

    def get_context_data(self, **kwargs: Any) -> dict:
        # Get the existing context from the parent class
        context = super().get_context_data(**kwargs)

        # Fetch chatbot configuration by bot_id
        chatbot_id = self.kwargs['chatbot_id']
        chatbot_configurations = get_object_or_404(
            ChatbotConfiguration, chatbot_id=chatbot_id)
        try:
            chatbot_submit_configurations = ChatbotSubmitConfiguration.objects.get(
                bot=chatbot_configurations)
        except ChatbotSubmitConfiguration.DoesNotExist:
            chatbot_submit_configurations = None

        # Add bot_name to context
        context['chatbot_id'] = chatbot_id
        context["bot_name"] = chatbot_configurations.name
        context["welcome_message"] = chatbot_configurations.welcome_message
        context["hero_image"] = chatbot_configurations.hero_img
        context["submit_url"] = chatbot_submit_configurations.url if chatbot_submit_configurations else None
        context["submit_method"] = chatbot_submit_configurations.method if chatbot_submit_configurations else None
        context["submit_authentication_key"] = chatbot_submit_configurations.authentication_key if chatbot_submit_configurations else None

        return context

    def get(self, request, *args, **kwargs):
        # Call the parent class to generate the response
        response = super().get(request, *args, **kwargs)

        # Fetch the chatbot configuration
        chatbot_id = self.kwargs['chatbot_id']
        chatbot_configurations = get_object_or_404(
            ChatbotConfiguration, chatbot_id=chatbot_id)

        if hasattr(chatbot_configurations, "allow_iframe"):
            # Exempt from X-Frame-Options (i.e., allow embedding in an iframe)
            # Set allowed origin dynamically if needed
            response['X-Frame-Options'] = 'ALLOW-FROM https://allowed-origin.com'
        else:
            # Set default X-Frame-Options to DENY or SAMEORIGIN
            response['X-Frame-Options'] = 'SAMEORIGIN'

        return response

    @method_decorator(xframe_options_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


# Create and Manage Bots (Staff Users)

class StaffUserMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff


class ChatbotCreateView(LoginRequiredMixin, StaffUserMixin, CreateView):
    model = ChatbotConfiguration
    form_class = ChatbotConfigurationForm
    template_name = 'chatbot/bot_form.html'
    success_url = reverse_lazy('bot-list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)


class ChatbotListView(LoginRequiredMixin, StaffUserMixin, ListView):
    model = ChatbotConfiguration
    template_name = 'chatbot/bot_list.html'
    context_object_name = 'bots'


class ChatbotUpdateView(LoginRequiredMixin, StaffUserMixin, UpdateView):
    model = ChatbotConfiguration
    form_class = ChatbotConfigurationForm
    template_name = 'chatbot/bot_form.html'
    success_url = reverse_lazy('bot-list')


class ChatbotDeleteView(LoginRequiredMixin, StaffUserMixin, DeleteView):
    model = ChatbotConfiguration
    template_name = 'chatbot/bot_confirm_delete.html'
    success_url = reverse_lazy('bot-list')


#  Manage Questions for a Bot (Staff Users)
class QuestionCreateView(LoginRequiredMixin, StaffUserMixin, CreateView):
    model = Question
    form_class = QuestionForm
    template_name = 'chatbot/question_form.html'

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        form.instance.bot = get_object_or_404(
            ChatbotConfiguration, pk=self.kwargs['bot_id'])
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('bot-detail', kwargs={'pk': self.kwargs['bot_id']})


class QuestionUpdateView(LoginRequiredMixin, StaffUserMixin, UpdateView):
    model = Question
    form_class = QuestionForm
    template_name = 'chatbot/question_form.html'

    def get_success_url(self):
        return reverse_lazy('bot-detail', kwargs={'pk': self.object.bot.pk})


class QuestionDeleteView(LoginRequiredMixin, StaffUserMixin, DeleteView):
    model = Question
    template_name = 'chatbot/question_confirm_delete.html'

    def get_success_url(self):
        return reverse_lazy('bot-detail', kwargs={'pk': self.object.bot.pk})


def get_question_details(question):
    question_title = question.question if question else None
    question_id = question.pk if question else None
    response_type = question.response_type if question else None
    variable = question.variable if question else None
    options = []
    if response_type in (QuestionTypes.CLICKLIST.value, QuestionTypes.DROPDOWN.value):
        question_options = QuestionOption.objects.filter(
            question=question).order_by("option_order").all()
        if question_options:
            for op in question_options:
                options.append(op.option_text)

    return {
        "question": question_title,
        "question_id": question_id,
        "response_type": response_type,
        "variable": variable,
        "options": options,
        "is_completed": True if question is None else False
    }


# Chatbot Interaction for End Users
class ChatSessionStartView(View):
    def post(self, request, chatbot_id):
        bot = get_object_or_404(ChatbotConfiguration, chatbot_id=chatbot_id)
        session = ChatSession.objects.create(
            session_id=str(uuid.uuid4()), bot=bot)
        first_question = Question.objects.filter(
            bot=session.bot, question_order__gt=-1).order_by('question_order').first()
        questions_data = get_question_details(first_question)

        return JsonResponse(
            {
                'session_id': session.session_id,
                **questions_data
            }
        )


class QuestionAnswerView(View):
    def post(self, request, session_id):
        session = get_object_or_404(ChatSession, session_id=session_id)
        # First, check if the content type is JSON
        if request.content_type == 'application/json':
            data = json.loads(request.body)  # Parse the JSON body
            question_id = data.get('question_id')
            answer = data.get('answer')
        else:
            question_id = request.POST.get('question_id')
            answer = request.POST.get('answer')

        # Save the answer
        question = get_object_or_404(Question, pk=question_id)
        ChatHistory.objects.create(
            session=session, question=question, response=answer)

        # Get the next question
        next_question = Question.objects.filter(
            bot=session.bot, question_order__gt=question.question_order).order_by('question_order').first()
        questions_data = get_question_details(next_question)

        return JsonResponse(
            {
                'session_id': session.session_id,
                **questions_data
            }
        )


class SubmitChatbotResponses(View):
    def post(self, request, session_id):
        session = get_object_or_404(ChatSession, session_id=session_id)
        bot = session.bot
        submit_config = get_object_or_404(ChatbotSubmitConfiguration, bot=bot)

        # Collect all chat history for the session
        history = ChatHistory.objects.filter(session=session)
        responses = {item.question.variable: item.response for item in history}

        # Submit to external URL (API call, in reality this would use requests or similar)
        # For now, we just return success
        return JsonResponse({'status': 'submitted'})
