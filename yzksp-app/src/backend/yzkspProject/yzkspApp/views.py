from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Event, Participant, Attendance
from .serializers import EventSerializer, ParticipantSerializer, AttendanceSerializer
import logging

@csrf_exempt
def main_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Invalid request method'}) 

class CustomLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        print(f"username:{username}")
        print(f"password:{password}")

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class CustomLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie('sessionid')
        return response

class RegisterView(APIView):
    @transaction.atomic
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
        Participant.objects.create(user=user)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


#@csrf_protect
@csrf_exempt
def get_username(request):
    print("request.user.username")
    print(request.user.username)
    if request.user.is_authenticated:
        return JsonResponse({"username": request.user.username})
    return JsonResponse({"username": "ユーザはログインしていません。"})

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Event, Participant, Attendance
from .serializers import EventSerializer, ParticipantSerializer, AttendanceSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def update(self, request, *args, **kwargs):
        print("Received data for update:", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        print("Validation errors:", serializer.errors)
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

class IsParticipantOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.participant.user == request.user

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipantOrReadOnly]

    def get_queryset(self):
        event_pk = self.kwargs.get('event_pk')
        if event_pk:
            return Attendance.objects.filter(event_id=event_pk).select_related('participant__user', 'event')
        return Attendance.objects.all().select_related('participant__user', 'event')

    def create(self, request, *args, **kwargs):
        event_pk = self.kwargs.get('event_pk')
        if not event_pk:
            return Response({"detail": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # event_idをリクエストデータに追加
        mutable_data = request.data.copy()
        mutable_data['event_id'] = event_pk
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
@api_view(['GET'])
def current_user_view(request):
    if request.user.is_authenticated:
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })
    else:
        return Response({'detail': 'Not authenticated'}, status=401)