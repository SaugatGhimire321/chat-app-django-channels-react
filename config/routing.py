from django.urls import path
 
from apps.chats.consumers import ChatConsumer
 
websocket_urlpatterns = [path("", ChatConsumer.as_asgi())]