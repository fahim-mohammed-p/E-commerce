from rest_framework import serializers
from .models import Order, OrderItem
from products.models import product

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.product_name', read_only=True)
    image = serializers.URLField(source='product.image_url', read_only=True)
    inch = serializers.IntegerField(source='product.inch', read_only=True)
    qty = serializers.IntegerField(source='quantity', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'image', 'inch', 'qty', 'price', 'product']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    orderDate = serializers.DateTimeField(source='created_at', read_only=True)
    totalPrice = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2, read_only=True)
    userEmail = serializers.EmailField(source='user.email', read_only=True)
    paymentMethod = serializers.CharField(source='payment_method', read_only=True)
    paymentStatus = serializers.CharField(source='payment_status', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'orderDate', 'totalPrice', 'userEmail', 'paymentMethod', 'paymentStatus', 'items']