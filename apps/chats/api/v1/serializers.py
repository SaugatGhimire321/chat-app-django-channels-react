from django.contrib.auth import get_user_model

from rest_framework import serializers

from apps.chats.models import Conversation, Message
from apps.users.api.v1.serializers import UserDetailSerializer

User = get_user_model()

class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "name", "other_user", "last_message")

    def get_last_message(self, obj):
        messages = obj.messages.all().order_by("-created_at")
        if not messages.exists():
            return None
        message = messages[0]
        return MessageSerializer(message).data
    
    def get_other_user(self, obj):
        usernames = obj.name.split("__")
        context = {}
        for username in usernames:
            if username != self.context["user"].username:
                other_user = User.objects.get(username=username)
                return UserDetailSerializer(other_user, context=context).data

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
