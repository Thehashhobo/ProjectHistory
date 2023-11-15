from django.urls import path
from . import views
from .views import NotificationDetail, NotificationList, NotificationCreate, NotificationUpdate, NotificationDelete
app_name = 'notifications'
# we need to update these urls to be nouns only
urlpatterns = [
    path('creation/<int:pk>/', NotificationCreate.as_view(), name='notification-create'),
    path('notifications/<int:pk>/', NotificationDetail.as_view(), name='notification-detail'),
    path('updates/<int:pk>/', NotificationUpdate.as_view(), name='notification-update'),
    path('deletion/<int:pk>/', NotificationDelete.as_view(), name='notification-delete'),
    path('', NotificationList.as_view(),name='notification-list'),
]