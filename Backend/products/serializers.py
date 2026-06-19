from rest_framework import serializers
from .models import product , category

class productserializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model=product
        fields= ['id', 'product_name', 'category', 'category_name', 'price', 'image_url', 'inch']


class categorySerializer(serializers.ModelSerializer):

    class Meta:
        model = category
        fields = "__all__"