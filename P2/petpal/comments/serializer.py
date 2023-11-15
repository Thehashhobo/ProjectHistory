from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment

        fields = ['comment_text', 'comment_creation_time', 'content_type', 'object_id']

    def validate(self, data):
        content_type = data.get('content_type')
        object_id = data.get('object_id')
        if not ContentType.objects.filter(pk=content_type.id).exists():
            raise serializers.ValidationError("Not a valid content type to comment on.")
        return data