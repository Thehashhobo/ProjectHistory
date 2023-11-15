from django.urls import path
from .views import PetListingCreate, PetListingDelete, PetListingList, PetListingUpdate #PetListingSearch

app_name = 'petListing'

urlpatterns = [
    path('creation/<int:pk>/', PetListingCreate.as_view(), name='petlisting-create'),
    path('updates/<int:pk>/', PetListingUpdate.as_view(), name='petlisting-update'),
    path('deletion/<int:pk>/', PetListingDelete.as_view(), name='petlisting-delete'),
    path('', PetListingList.as_view(),name='petlisting-list'),
    # path('search/', PetListingSearch.as_view(), name='petlisting-search'),
]