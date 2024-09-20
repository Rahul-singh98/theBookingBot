from django.contrib import admin
from .models import (
    ChatbotConfiguration, Question, QuestionOption,
    ChatSession, ChatHistory, ChatbotSubmitConfiguration
)


class ChatbotConfigurationAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at', 'updated_at')
    search_fields = ('name', 'created_by__username')

    def get_queryset(self, request):
        """Limit visibility to staff users"""
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()  # Only staff should see the entries

    def has_module_permission(self, request):
        """Limit access to admin and staff only"""
        return request.user.is_staff or request.user.is_superuser


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'question_order',
                    'response_type', 'created_by')
    search_fields = ('question', 'bot__name', 'created_by__username')

    def get_queryset(self, request):
        """Limit visibility to staff users"""
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser


class QuestionOptionAdmin(admin.ModelAdmin):
    list_display = ('question', 'option_text', 'option_order')
    search_fields = ('option_text', 'question__question')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser


class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'bot', 'created_at')
    search_fields = ('session_id', 'bot__name')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser


class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'response', 'created_at')
    search_fields = ('session__session_id', 'question__question')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser


class ChatbotSubmitConfigurationAdmin(admin.ModelAdmin):
    list_display = ('url', 'method', 'authentication_key', 'bot')
    search_fields = ('url', 'bot__name')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_staff:
            return queryset
        return queryset.none()

    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser


# Register the models and their corresponding admin classes
admin.site.register(ChatbotConfiguration, ChatbotConfigurationAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(QuestionOption, QuestionOptionAdmin)
admin.site.register(ChatSession, ChatSessionAdmin)
admin.site.register(ChatHistory, ChatHistoryAdmin)
admin.site.register(ChatbotSubmitConfiguration,
                    ChatbotSubmitConfigurationAdmin)
