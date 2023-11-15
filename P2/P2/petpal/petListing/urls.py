from django.urls import path
from . import views
from .views import PetListingCreate, PetListingDelete, PetListingList, PetListingUpdate, CreateApplication 
app_name = 'petListing'
# we need to update these urls to be nouns only
urlpatterns = [
    path('petListing/', PetListingCreate.as_view(), name='petlisting-create'),
    path('petListing/update/<int:pk>/', PetListingUpdate.as_view(), name='petlisting-update'),
    path('petListing/delete/<int:pk>/', PetListingDelete.as_view(), name='petlisting-delete'),
    path('', PetListingList.as_view(),name='petlisting-list'),
    path('petListing/<int:pk>/applications/', CreateApplication.as_view()),
    path('applications/status/<int:pk>/', views.UpdateApplication.as_view()),
    path('applications/<int:pk>/', views.GetApplication.as_view()),
]