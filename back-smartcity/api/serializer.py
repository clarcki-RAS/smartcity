from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Signalement,Image,MlModel,Prediction,Notification

User = get_user_model()
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
        write_only=True
    )
    uploaded_images = ImageSerializer(source='images', many=True, read_only=True)
    class Meta:
        model = Signalement
        fields = ['url', 'description', 'status', 'created_at', 'images', 'uploaded_images']

    def create(self, validated_data):
        images = validated_data.pop('images')
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
        model: Notification
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