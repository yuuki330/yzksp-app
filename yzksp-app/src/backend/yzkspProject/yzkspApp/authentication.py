from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User
from .models import Participant

class TemporaryAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # 開発用のデフォルトユーザーを取得または作成
        user, created = User.objects.get_or_create(username='temp_user')
        # デフォルトの参加者を取得または作成
        participant, created = Participant.objects.get_or_create(user=user)
        return (user, None)