from django.shortcuts import render
from rest_framework import generics
from .models import Notification
from accounts .models import PetPalUser, PetSeeker, PetShelter
from .serializers import NotificationSerializer, NotificationUpdateSerializer
from rest_framework.pagination import PageNumberPagination
# Create your views here.

class NotificationPagination(PageNumberPagination):
    page_size = 4

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user

        if user.is_pet_seeker:
            pet_seeker = PetSeeker.objects.filter(user=user).first()
            if pet_seeker:
                return Notification.objects.filter(recipient_id=pet_seeker.pk).order_by('-created_at')
        elif user.is_pet_shelter:
            pet_shelter = PetShelter.objects.filter(user=user).first()
            if pet_shelter:
                return Notification.objects.filter(recipient_id=pet_shelter.pk).order_by('-created_at')

        return Notification.objects.none()



class NotificationUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        # You can add any extra logic before saving the update
        serializer.save(is_read=True)


    def retrieve(self, request, *args, **kwargs):
        # Mark the notification as read when retrieved
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        return super().retrieve(request, *args, **kwargs)
    
    

