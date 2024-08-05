# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('main_view/', views.main_view, name='main_view'),
]
