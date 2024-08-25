from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Event(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateTimeField()
    description = models.TextField(blank=True)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events', null=True, blank=True)

    def __str__(self):
        return self.name

class ParticipantManager(models.Manager):
    def get_or_create_for_user(self, user):
        try:
            return self.get(user=user)
        except Participant.DoesNotExist:
            return self.create(user=user)

class Participant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)

    objects = ParticipantManager()

    def __str__(self):
        return self.user.username

class Attendance(models.Model):
    ATTENDANCE_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendances')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=10, choices=ATTENDANCE_CHOICES, default='absent')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['event', 'participant']
    
    def __str__(self):
        return f"{self.participant} - {self.event} - {self.status}"

    def clean(self):
        if self.status not in dict(self.ATTENDANCE_CHOICES):
            raise ValidationError({'status': 'Invalid attendance status'})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)