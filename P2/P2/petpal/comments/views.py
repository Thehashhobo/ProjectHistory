from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .serializer import CommentSerializer
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework import status, serializers
from rest_framework.response import Response
from .models import Comment
from petListing.models import Application
from django.utils import timezone
from notifications.models import Notification
from accounts.models import PetShelter
# Create your views here.

################# Shelter Comments #################
class ShelterCommentListCreate(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer_instance = CommentSerializer(data=request.data)
        if serializer_instance.is_valid():
            # cannot comment on a shelter that does not exist
            shelter_id = self.kwargs['pk']
            if not Application.objects.filter(pk=shelter_id).exists():
                raise serializers.ValidationError("Not a valid shelter to comment on.")
            #create notification to be viewed by shelter
            comment = serializer_instance.save(comment_made_by_the_user=self.request.user,object_id=shelter_id)
            pet_pal_user = PetShelter.objects.get(id=shelter_id).user
            notification_message = f"New comment on shelter {shelter_id}"
            Notification.objects.create(
            user = pet_pal_user,
            message = notification_message,
            related_comment = comment
            )
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        shelter_id = self.kwargs['pk']
        return Comment.objects.filter(object_id=shelter_id).order_by('-comment_creation_time')
    
################# Application Comments #################

class ApplicationCommentListCreate(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer_instance = CommentSerializer(data=request.data)
        if serializer_instance.is_valid():
            # step 1: make sure the application exists
            application_id = self.kwargs['pk']
            if not Application.objects.filter(pk=application_id).exists():
                raise serializers.ValidationError("Not a valid application to comment on.")
            
            # step 2: check who wants to comment and validate/save accordingly
            
            application = Application.objects.get(pk=application_id)
            
            if application.pet_seeker == self.request.user:
                application.last_updated = timezone.now()
                application.save()
                #create notification to be viewed by shelter
                comment = serializer_instance.save(comment_made_by_the_user=self.request.user, object_id=application_id)
                notification_message = f"New comment on application {application_id} by seeker"
                Notification.objects.create(
                user = Application.objects.get(pk = application_id).pet_seeker,
                message = notification_message,
                related_comment = comment
                )
                return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
            elif application.pet_listing.shelter.user == self.request.user:
                notification_message = f"New comment on application {application_id} by shelter"
                comment = serializer_instance.save(comment_made_by_the_user=self.request.user, object_id=application_id)
                Notification.objects.create(
                user = Application.objects.get(pk = application_id).pet_seeker,
                message = notification_message,
                related_comment = comment
                )
                return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
            else:
                raise serializers.ValidationError("You are not authorized to comment on this application.")
        else:
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    def get_queryset(self):
        application_id = self.kwargs['pk']
        if not Application.objects.filter(pk=application_id).exists():
            raise serializers.ValidationError("Not a valid application to comment on.")
        application = Application.objects.get(pk=application_id)
        if application.pet_seeker == self.request.user:
            return Comment.objects.filter(object_id=application_id).order_by('-comment_creation_time')
        elif application.pet_listing.shelter == self.request.user:
            return Comment.objects.filter(object_id=application_id).order_by('-comment_creation_time')
        else:
            raise serializers.ValidationError("You are not authorized to comment on this application.")