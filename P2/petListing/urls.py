from django.urls import path
from .views import PetListingCreate, PetListingDelete, PetListingList, PetListingUpdate #PetListingSearch

app_name = 'petListing'

urlpatterns = [
    path('creation/', PetListingCreate.as_view(), name='petlisting-create'),
    path('update/<int:pk>/', PetListingUpdate.as_view(), name='petlisting-update'),
    path('delete/<int:pk>/', PetListingDelete.as_view(), name='petlisting-delete'),
    path('', PetListingList.as_view(),name='petlisting-list'),
    # path('search/', PetListingSearch.as_view(), name='petlisting-search'),
]