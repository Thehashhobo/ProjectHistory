from django.urls import path
from . import views
from .views import NotificationListView, NotificationUpdateDeleteView
app_name = 'notifications'
# we need to update these urls to be nouns only
urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationUpdateDeleteView.as_view(), name='notification-delete+update'),
]