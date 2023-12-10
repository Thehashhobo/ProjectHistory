from rest_framework import serializers
from .models import Notification
from accounts.models import PetShelter
from petListing.models import Application
from django.contrib.contenttypes.models import ContentType

from django.urls import reverse

class NotificationSerializer(serializers.ModelSerializer):
    comment_url = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'user', 'recipient', 'message', 'is_read', 'created_at', 'comment_url']

    def get_comment_url(self, obj):
        try:
            content_type = ContentType.objects.get_for_id(obj.related_comment.content_type_id)
            if content_type.model == 'petshelter':
                return reverse('list_shelter_comments', args=[obj.related_comment.object_id])
            elif content_type.model == 'application':
                return reverse('list_application_comments', args=[obj.related_comment.object_id])
        except ContentType.DoesNotExist:
            return None
        return None


