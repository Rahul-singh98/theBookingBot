from django.db import models
from django.conf import settings
from .utils import QuestionTypes


# Questions Table to store the form data
class Question(models.Model):
    question = models.CharField(max_length=300, null=False)
    type = models.CharField(
        max_length=15, null=False,
        choices=QuestionTypes.choices(),
        default=QuestionTypes.NONE
    )
    variable = models.CharField(max_length=255, null=False)
    options = models.JSONField(null=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='questions_created_by'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ChatBot(models.Model):
    name = models.CharField(max_length=255, null=False)
    thumbnail = models.CharField(max_length=300)
    questions = models.ForeignKey(
        to=Question, 
        on_delete=models.CASCADE, 
        # on_update=models.CASCADE
    )

    created_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        # on_update=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

