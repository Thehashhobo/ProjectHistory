from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

# Create your models here.

class Comment(models.Model):
    # user's comment info
    comment_made_by_the_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=1000)
    comment_creation_time = models.DateTimeField(auto_now_add=True)

    # thing being commented on info
    content_type  = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id  = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')