from rest_framework import serializers
from django.contrib.auth.models import User

class regserializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken. Try another name.")
        return value

    def validate_email(self, value):
        value = value.strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email address is already registered. Try logging in instead.")
        return value

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