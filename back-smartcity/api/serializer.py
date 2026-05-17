from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Signalement,Image,MlModel,Prediction,Notification

User = get_user_model()

class SmartCityTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','first_name','last_name','password','date_joined','role']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined':{'read_only': True},
            'role':{'read_only':True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
  
        
class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model= Image
        fields= '__all__'
        extra_kwargs={
            'image_url':{
                'required':True
            },
            'signalement':{
                'read_only':True
            }
        }

class SignalementSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    uploaded_images = ImageSerializer(source='images', many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Signalement
        fields = ['id', 'description', 'localisation', 'status', 'created_at', 'user', 'images', 'uploaded_images']
        read_only_fields = ['id', 'created_at', 'user']

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        user = self.context['request'].user
        signalement = Signalement.objects.create(user=user, **validated_data)
        for img in images:
            Image.objects.create(signalement=signalement, image_url=img)
        return signalement

    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images:
            for img in images:
                Image.objects.create(signalement=instance, image_url=img)
        return instance
class MlModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MlModel
        fields = "__all__"

class PredictionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta: 
        model = Prediction
        fields = "__all__"

class NotificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notification
        fields= '__all__'
        # extra_kwargs={
        #     'destinataire':{
        #         'read_only':True
        #     },
        #     'date':{
        #         'read_only':True
        #     },
        #     'signalement':{
        #         'read_only':True
        #     }
        # }
