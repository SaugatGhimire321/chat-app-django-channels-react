from rest_framework.routers import DefaultRouter

from apps.chats.api.v1.views import ConversationViewSet, MessageViewSet


router = DefaultRouter()

router.register(r"conversations", ConversationViewSet, basename='conversation')
router.register(r"messages", MessageViewSet, basename='message')

app_name = "chats"
urlpatterns = router.urls