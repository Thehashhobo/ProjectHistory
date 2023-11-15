from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    PetSeekerRegisterView,  
    PetSeekerDetailUpdateDeleteView,
    PetShelterRegisterListView,
    PetShelterDetailUpdateDeleteView,
    

    # PetShelterRegistrationView, 
    # PetShelterListView, 
    # PetShelterUpdateView, 
    # PetSeekerUpdateView, 
    # PetShelterDetailView, 
    # PetSeekerDeleteView,
    # PetShelterDeleteView,
)


urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('petshelter/', PetShelterRegisterListView.as_view()),

    # path('petshelter/registration/', PetShelterRegistrationView.as_view()), #post
    # path('petshelter/', PetShelterListView.as_view()), #get

    path('petshelter/<int:pk>/', PetShelterDetailUpdateDeleteView.as_view()),

    # path('petshelter/detail/<int:pk>/', PetShelterDetailView.as_view()), #get
    # path('petshelter/<int:pk>/', PetShelterUpdateView.as_view()), #put
    # path('petshelter/delete/<int:pk>/', PetShelterDeleteView.as_view()), #delete

    path('petseeker/', PetSeekerRegisterView.as_view()),
    path('petseeker/<int:pk>/', PetSeekerDetailUpdateDeleteView.as_view()),

    # path('petseeker/<int:pk>/', PetSeekerUpdateView.as_view()),
    # path('petseeker/delete/<int:pk>/', PetSeekerDeleteView.as_view()),
    # # path('petseeker/detail/<int:pk>/', PetSeekerDetailView.as_view()),

    
]