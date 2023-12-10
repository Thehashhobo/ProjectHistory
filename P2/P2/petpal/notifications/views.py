from django.shortcuts import render
from rest_framework import generics
from .models import Notification
from accounts .models import PetPalUser
from .serializers import NotificationSerializer
from rest_framework.pagination import PageNumberPagination
# Create your views here.

class NotificationPagination(PageNumberPagination):
    page_size = 4

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        # Filter notifications for the logged-in user
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        # Restrict to notifications belonging to the current user
        return Notification.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # You can add any extra logic before saving the update
        serializer.save(is_read=self.request.data.get('is_read', True))

    def retrieve(self, request, *args, **kwargs):
        # Mark the notification as read when retrieved
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        return super().retrieve(request, *args, **kwargs)

