from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import logging
logger = logging.getLogger(__name__)

# Create your views here.

@csrf_exempt
def main_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Invalid request method'}) 

from django.contrib.auth import authenticate, login
from allauth.account.views import LoginView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import logout

class CustomLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            logger.info('get_username function called')
            print(f'CustomLoginView:username: {request.user.username}')
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class CustomLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)   

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"message": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# from django.contrib.auth.decorators import login_required
# @login_required



# from django.views.decorators.csrf import ensure_csrf_cookie
# @ensure_csrf_cookie

@csrf_exempt
def get_username(request):
    # logger.info(f'username: {request.user.username}')
    # print(f'username: {request.user.username}')
    # return JsonResponse({'username': request.user.username})

    # logger.info(f'username: {request.user.username}')
    # print(f'username: {request.user.username}')
    return JsonResponse({'username': "request.user.username"})
