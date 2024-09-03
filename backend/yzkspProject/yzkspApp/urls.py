from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ParticipantViewSet, AttendanceViewSet
from .views import *
from . import views
from django.views.generic import RedirectView

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'attendances', AttendanceViewSet, basename='attendance')

api_urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('get-username/', views.get_username, name='get_username'),
    path('current-user/', current_user_view, name='current_user'),
    path('events/<int:event_pk>/attendances/', AttendanceViewSet.as_view({'get': 'list', 'post': 'create'}), name='event-attendances'),
]

urlpatterns = [
    path('', RedirectView.as_view(url='/api/', permanent=False)),
    path('api/', include(api_urlpatterns)),
]