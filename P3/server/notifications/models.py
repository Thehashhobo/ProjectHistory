from django.db import models
from django.conf import settings
from comments.models import Comment
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Notification(models.Model):
    # Sender of the comment
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='sent_notifications'  # unique related name for user
    )

    # Recipient of the comment
    recipient_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, related_name='notification_recipient')
    recipient_id = models.PositiveIntegerField(null=True)
    recipient = GenericForeignKey('recipient_type', 'recipient_id')

    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_comment = models.ForeignKey(Comment, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"Notification for {self.user.email} - Read: {self.is_read}"
