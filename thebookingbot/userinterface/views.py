from django.shortcuts import render
from django.views.generic import DetailView

# Create your views here.
class ApplicationView(DetailView):

    def get(self, request, *args, **kwargs):
        return render(request, "userinterface.html")