from rest_framework import serializers
from django.contrib.auth.models import User

class regserializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )

        user.set_password(validated_data['password'])  # 🔥 important
        user.save()

        return user


class UserListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='username')
    banned = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'banned']

    def get_banned(self, obj):
        return not obj.is_active