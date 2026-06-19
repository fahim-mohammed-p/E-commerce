from django.urls import path
from .views import productview , categoryListView , updateview , categoryDetailView


urlpatterns = [
    path("", productview.as_view()),
    path("<int:pk>/", updateview.as_view()),
    path("category/", categoryListView.as_view()),
    path("category/<int:pk>/", categoryDetailView.as_view()),
]