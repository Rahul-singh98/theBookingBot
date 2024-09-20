from django import forms
from .models import ChatbotConfiguration, Question

class ChatbotConfigurationForm(forms.ModelForm):
    class Meta:
        model = ChatbotConfiguration
        fields = ['name', 'hero_img', 'welcome_message', 'primary_color', 'secondary_color']

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['question', 'question_order', 'response_type', 'variable']
