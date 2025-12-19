from rest_framework import viewsets,filters
from .serializer import UserSerializer,SignalementSerializer,ImageSerializer,MlModelSerializer,PredictionSerializer,NotificationSerializer
from django.contrib.auth import get_user_model
from .models import Image,Signalement,MlModel,Prediction,Notification
from . import permission as custom_permissions
from .mixin import UserQuerysetMixin
from rest_framework.permissions import IsAuthenticated 
User=get_user_model()
class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes=[custom_permissions.AnonymousOrSuperuserPostOnly,custom_permissions.OnlySuperuserGet,IsAuthenticated]
    filter_backends=[filters.SearchFilter]
    search_fields = ['id', 'username', 'email','first_name','last_name','date_joined','role',]


class SignalementViewSet(UserQuerysetMixin,viewsets.ModelViewSet):
    serializer_class=SignalementSerializer
    queryset=Signalement.objects.all()
    filter_backends=[filters.SearchFilter]
    search_fields=['status','description','created_at']
    permission_classes=[custom_permissions.IsOwnerOrSuperUser]

class ImageViewSet(viewsets.ModelViewSet):
    queryset=Image.objects.all()
    http_method_names=['patch','delete']
    permission_classes=[custom_permissions.IsOwnerOrSuperUser]
    serializer_class=ImageSerializer

class MlModelViewSet(viewsets.ModelViewSet):
    queryset=MlModel.objects.all().order_by("-created_at")
    serializer_class=MlModelSerializer
    
class PredictionViewSet(viewsets.ModelViewSet):
    queryset=Prediction.objects.all().order_by("-created_at")
    serializer_class= PredictionSerializer

class NotificationViewSet(viewsets.ModelViewSet,UserQuerysetMixin):
    queryset=Notification.objects.all()
    serializer_class= NotificationSerializer