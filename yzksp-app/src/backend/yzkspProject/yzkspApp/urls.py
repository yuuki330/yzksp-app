from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ParticipantViewSet, AttendanceViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'attendances', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
