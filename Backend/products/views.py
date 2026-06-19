from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import product , category
from .serializers import productserializer , categorySerializer

class productview(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def get(self, request):
        prod=product.objects.all()
        serializer= productserializer(prod , many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = productserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class updateview(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self , request , pk):
        try:
            prod = product.objects.get(id=pk)
            serializer = productserializer(prod)
            return Response(serializer.data)
        
        except:

            return Response({
                'message' : 'Product not  found'},
                status=404
                )

    def put(self, request, pk):
        try:
            prod = product.objects.get(id=pk)
        except product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=404)
        serializer = productserializer(prod, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            prod = product.objects.get(id=pk)
        except product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=404)
        serializer = productserializer(prod, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            prod = product.objects.get(id=pk)
        except product.DoesNotExist:
            return Response({'message': 'Product not found'}, status=404)
        prod.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

class categoryListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):

        categories = category.objects.all()

        serializer = categorySerializer(
            categories,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = categorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class categoryDetailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, pk):
        try:
            cat = category.objects.get(id=pk)
        except category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)
        serializer = categorySerializer(cat)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            cat = category.objects.get(id=pk)
        except category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)
        serializer = categorySerializer(cat, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            cat = category.objects.get(id=pk)
        except category.DoesNotExist:
            return Response({'message': 'Category not found'}, status=404)
        cat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
