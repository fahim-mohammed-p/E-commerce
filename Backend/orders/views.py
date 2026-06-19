from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Order, OrderItem
from products.models import product as ProductModel
from .serializers import OrderSerializer

User = get_user_model()


class OrderList(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        user_email = data.get("userEmail")
        items = data.get("items", [])
        total_price = data.get("totalPrice")
        payment_method = data.get("paymentMethod")
        payment_status = data.get("paymentStatus", "pending")

        # Find user or fallback
        user = None
        if user_email:
            user = User.objects.filter(email=user_email).first()

        if not user:
            for item in items:
                u_id = item.get("user")
                if u_id:
                    user = User.objects.filter(id=u_id).first()
                    if user:
                        break

        if not user:
            user = User.objects.first()
            if not user:
                user = User.objects.create_user(username="temp_buyer", email=user_email or "temp@example.com")

        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user=user,
                    total_amount=total_price,
                    payment_method=payment_method,
                    payment_status=payment_status
                )

                for item in items:
                    prod_id = item.get("product")
                    qty = item.get("qty", 1)
                    price = item.get("price")

                    prod_obj = ProductModel.objects.get(id=prod_id)

                    OrderItem.objects.create(
                        order=order,
                        product=prod_obj,
                        quantity=qty,
                        price=price
                    )

                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)