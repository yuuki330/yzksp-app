from rest_framework import serializers
from .models import Event, Participant, Attendance

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'description', 'organizer']
        extra_kwargs = {'organizer': {'required': False}}

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'user', 'phone_number']

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'event', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        # TemporaryAuthentication によって提供されるユーザーを使用
        participant = Participant.objects.get(user=request.user)
        validated_data['participant'] = participant
        return super().create(validated_data)