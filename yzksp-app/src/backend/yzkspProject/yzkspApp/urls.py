# myapp/urls.py
from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('main_view/', views.main_view, name='main_view'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('get-username/', views.get_username, name='get_username'),
]
