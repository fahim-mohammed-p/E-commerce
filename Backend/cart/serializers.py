from rest_framework import serializers
from .models import Cart


class CartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.product_name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    image = serializers.URLField(source='product.image_url', read_only=True)
    inch = serializers.IntegerField(source='product.inch', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'qty', 'name', 'price', 'image', 'inch']