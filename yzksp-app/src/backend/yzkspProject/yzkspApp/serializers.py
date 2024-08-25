from rest_framework import serializers
from .models import Attendance, Participant, Event
from django.contrib.auth.models import User
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ['id', 'user']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'description']

class AttendanceSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Attendance
        fields = ['id', 'event_id', 'status', 'timestamp', 'user_id']

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("認証されていないユーザーです。")

        event_id = validated_data.pop('event_id')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError("指定されたイベントが見つかりません。")

        # user_idが提供されていない場合は、認証されたユーザーを使用
        user_id = validated_data.pop('user_id', None)
        user = User.objects.get(id=user_id) if user_id else request.user

        participant, _ = Participant.objects.get_or_create(user=user)

        attendance, _ = Attendance.objects.update_or_create(
            event=event,
            participant=participant,
            defaults={'status': validated_data.get('status')}
        )
        return attendance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['event'] = {
            'id': instance.event.id,
            'name': instance.event.name
        }
        representation['participant'] = {
            'id': instance.participant.id,
            'username': instance.participant.user.username
        }
        return representation
