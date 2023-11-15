from django.db import models
from django.conf import settings

# Create your models here.
class Notification(models.Model):
    READ_CHOICES = [
        ('read', 'Read'),
        ('unread', 'Unread'),
    ]

    NOTIFICATION_TYPES = [
        ('new_review', 'New Review'),
        ('new_application', 'New Application'),
        ('application_comment', 'Application Comment'),
        ('application_status_change', 'Application Status Change'),
    ]

    is_active = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creation_time = models.DateTimeField(auto_now_add=True)
    read_status = models.CharField(max_length=6, choices=READ_CHOICES)
    message = models.TextField() 
