from rest_framework import serializers

from apps.chats.models import Message
from apps.users.api.v1.serializers import UserDetailSerializer


class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    conversation = serializers.SerializerMethodField()
 
    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "from_user",
            "to_user",
            "content",
            "created_at",
            "read",
        )
 
    def get_conversation(self, obj):
        return str(obj.conversation.id)
 
    def get_from_user(self, obj):
        return UserDetailSerializer(obj.from_user).data
 
    def get_to_user(self, obj):
        return UserDetailSerializer(obj.to_user).data
