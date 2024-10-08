from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Event, Participant, Attendance
from .serializers import EventSerializer, ParticipantSerializer, AttendanceSerializer
from .permissions import IsParticipantOrReadOnly
import logging
from django.middleware.csrf import get_token

logger = logging.getLogger(__name__)

@ensure_csrf_cookie
def main_view(request):
    if request.method == 'POST':
        return JsonResponse({'message': 'Invalid request method'})
    return JsonResponse({'message': 'Welcome to the API'})

@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        logger.info(f"Login attempt for username: {username}")

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            csrf_token = get_token(request)
            response = Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                },
                "csrf_token": csrf_token
            }, status=status.HTTP_200_OK)
            response.set_cookie('csrftoken', csrf_token, httponly=False, samesite='None', secure=True)
            return response
        logger.warning(f"Failed login attempt for username: {username}")
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class CustomLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.info(f"Logout attempt for user: {request.user.username}")
        logout(request)
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        return response

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def get_username(request):
    logger.debug(f"get_username called for user: {request.user}")
    if request.user.is_authenticated:
        return JsonResponse({"username": request.user.username})
    return JsonResponse({"username": "ユーザはログインしていません。"}, status=status.HTTP_401_UNAUTHORIZED)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        logger.info(f"Update attempt for event: {kwargs.get('pk')}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        logger.warning(f"Validation errors in event update: {serializer.errors}")
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated]

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_pk = self.kwargs.get('event_pk')
        if event_pk:
            return Attendance.objects.filter(event_id=event_pk).select_related('participant__user', 'event')
        return Attendance.objects.all().select_related('participant__user', 'event')

    def create(self, request, *args, **kwargs):
        logger.info(f"Attendance creation attempt for user: {request.user.username}")

        mutable_data = request.data.copy()
        mutable_data['event_id'] = self.kwargs.get('event_pk')

        participant, created = Participant.objects.get_or_create(user=request.user)
        mutable_data['participant_id'] = participant.id

        serializer = self.get_serializer(data=mutable_data, context={'request': request})

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.warning(f"Validation errors in attendance creation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def current_user_view(request):
    logger.info(f"Current user view accessed. User: {request.user}")
    logger.info(f"Session data: {request.session.items()}")
    
    if request.user.is_authenticated:
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })
    else:
        logger.warning("Unauthenticated user tried to access current_user_view")
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)