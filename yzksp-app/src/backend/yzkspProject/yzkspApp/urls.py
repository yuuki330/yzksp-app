# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home_view'),
    path('main_view/', views.main_view, name='main_view'),
]
