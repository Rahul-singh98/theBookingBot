from django.db import models
from .utils import QuestionTypes, AuthMethodChoices
from django.contrib.auth.models import User


class ChatbotConfiguration(models.Model):
    name = models.CharField(
        max_length=100, default='The Booking Bot', null=False)
    chatbot_id = models.CharField(
        max_length=36, unique=True)
    hero_img = models.CharField(max_length=255, null=False)
    welcome_message = models.CharField(max_length=255, blank=True, null=True)
    primary_color = models.CharField(max_length=7, blank=True, null=True)
    secondary_color = models.CharField(max_length=7, blank=True, null=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    bot = models.ForeignKey(ChatbotConfiguration,
                            on_delete=models.CASCADE)
    question = models.CharField(max_length=300, null=False)
    question_order = models.IntegerField(null=False)
    response_type = models.CharField(
        max_length=15, null=False,
        choices=QuestionTypes.choices(),
        default=QuestionTypes.INPUT
    )
    variable = models.CharField(max_length=255, null=False)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='questions_created_by'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option_text = models.CharField(max_length=255, null=False)
    option_order = models.IntegerField(null=False)

    def __str__(self):
        return self.option_text


class ChatSession(models.Model):
    session_id = models.CharField(max_length=36, unique=True, null=False)
    bot = models.ForeignKey(ChatbotConfiguration, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.session_id


class ChatHistory(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.TextField(null=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Session: {self.session.session_id} - Question: {self.question.question}'


class ChatbotSubmitConfiguration(models.Model):
    url = models.CharField(max_length=255, null=False)
    method = models.CharField(
        max_length=4, choices=AuthMethodChoices.choices(), default=AuthMethodChoices.POST)
    authentication_key = models.CharField(
        max_length=255, blank=True, null=True)
    bot = models.ForeignKey(ChatbotConfiguration, on_delete=models.CASCADE)

    def __str__(self):
        return self.url
