from rest_framework.routers import DefaultRouter, SimpleRouter

from apps.chats.api.v1.views import ConversationViewSet


router = DefaultRouter()

router.register(r"", ConversationViewSet, basename='conversation')

app_name = "chats"
urlpatterns = router.urls