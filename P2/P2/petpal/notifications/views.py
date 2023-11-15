from django.shortcuts import render
from rest_framework import generics
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class NotificationCreate(APIView):
    def post(self, request, format=None):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        # Ensure users can only see their own notifications
        return Notification.objects.filter(user=self.request.user)

class NotificationDetail(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        # Users can only access their own notifications
        return Notification.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        # Mark notification as read when retrieved
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        return super().retrieve(request, *args, **kwargs)

class NotificationUpdate(generics.UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_read=self.request.data.get('is_read', True))

class NotificationDelete(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)