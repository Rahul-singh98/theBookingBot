from .views import (
    ChatbotCreateView, ChatbotListView, ChatbotUpdateView, ChatbotDeleteView, QuestionCreateView,
    QuestionUpdateView, QuestionDeleteView, ChatSessionStartView, QuestionAnswerView, SubmitChatbotResponses
)
from django.urls import path
from .views import ChatBot


urlpatterns = [
    path("chatbot/<str:chatbot_id>/", ChatBot.as_view(), name='chatbot-view'),
    path('bot/create/', ChatbotCreateView.as_view(), name='bot-create'),
    path('bot/list/', ChatbotListView.as_view(), name='bot-list'),
    path('bot/update/<int:pk>/', ChatbotUpdateView.as_view(), name='bot-update'),
    path('bot/delete/<int:pk>/', ChatbotDeleteView.as_view(), name='bot-delete'),

    path('bot/<int:bot_id>/question/add/',
         QuestionCreateView.as_view(), name='question-add'),
    path('bot/<int:bot_id>/question/<int:pk>/update/',
         QuestionUpdateView.as_view(), name='question-update'),
    path('bot/<int:bot_id>/question/<int:pk>/delete/',
         QuestionDeleteView.as_view(), name='question-delete'),

    path('chat/start-session/<str:chatbot_id>/',
         ChatSessionStartView.as_view(), name='start-session'),
    path('chat/next-question/<str:session_id>/',
         QuestionAnswerView.as_view(), name='next-question'),
    path('chat/submit/<str:session_id>/',
         SubmitChatbotResponses.as_view(), name='submit-chat'),
]
