from django.urls import path,include
from .views import UserViewSet,SignalementViewSet,MlModelViewSet,PredictionViewSet,NotificationViewSet,ImageViewSet
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r"users",UserViewSet)
router.register(r"signalements",SignalementViewSet)
router.register(r"mlmodel",MlModelViewSet)
router.register(r'predictions',PredictionViewSet)
router.register(r'notifications',NotificationViewSet)
router.register(r"images",ImageViewSet)
urlpatterns = [
    path('',include(router.urls)),
]
