from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from products.models import product
from .models import Cart
from .serializers import CartSerializer


class CartView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        user_id = request.query_params.get("user")
        if user_id:
            carts = Cart.objects.filter(user_id=user_id)
        else:
            carts = Cart.objects.all()
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("POST cart data received:", request.data)
        user = User.objects.get(id=request.data["user"])
        product_obj = product.objects.get(id=request.data["product"])
        cart_item, created = Cart.objects.get_or_create(user=user, product=product_obj, defaults={'qty': 1})
        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CartDetailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def patch(self, request, pk):
        print("PATCH request data received:", request.data)
        try:
            cart_item = Cart.objects.get(id=pk)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CartSerializer(cart_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("PATCH succeeded:", serializer.data)
            return Response(serializer.data)
        print("PATCH validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            cart_item = Cart.objects.get(id=pk)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)