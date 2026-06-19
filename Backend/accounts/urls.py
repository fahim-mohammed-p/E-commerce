from django.urls import path
from .views import register, AdminLogin, UserListView, UserDetailView

urlpatterns = [
    path("register/", register.as_view()),
    path("login/", AdminLogin.as_view()),
    path("users/", UserListView.as_view()),
    path("users/<int:pk>/", UserDetailView.as_view()),
]