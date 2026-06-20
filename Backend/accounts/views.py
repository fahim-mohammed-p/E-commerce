from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import AllowAny
from .serializers import regserializer, UserListSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import threading

User = get_user_model()

class register(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = regserializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            def send_async_email(user_username, user_email):
                try:
                    send_mail(
                        "Welcome 🎉",
                        f"Hi {user_username}, your account has been created successfully!",
                        settings.EMAIL_HOST_USER,
                        [user_email],
                        fail_silently=False,
                    )
                except Exception:
                    pass

            threading.Thread(
                target=send_async_email,
                args=(user.username, user.email)
            ).start()

            return Response(
                {'message': 'Registered Successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminLogin(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if username:
            username = username.strip()
            if "@" in username:
                user_obj = User.objects.filter(email__iexact=username).first()
                if user_obj:
                    username = user_obj.username

        user_exists = User.objects.filter(username=username).first()
        if user_exists and not user_exists.is_active:
            if user_exists.check_password(password):
                return Response(
                    {"error": "You are banned by admin"},
                    status=403
                )

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid Credentials"},
                status=401
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "is_superuser": user.is_superuser,
            "is_staff": user.is_staff,
            "username": user.username
        })


class UserListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        users = User.objects.filter(is_superuser=False, is_staff=False)
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def patch(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        banned = request.data.get("banned")
        if banned is not None:
            user.is_active = not banned
            user.save()

        serializer = UserListSerializer(user)
        return Response(serializer.data)

                


