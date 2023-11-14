from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import PetSeekerRegistrationView,  PetShelterRegistrationView, PetShelterListView, PetShelterUpdateView, PetSeekerUpdateView, PetShelterDetailView


urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('petseeker/registration/', PetSeekerRegistrationView.as_view()),
    path('petshelter/registration/', PetShelterRegistrationView.as_view()),
    path('petshelter/', PetShelterListView.as_view()),
    path('petshelter/detail/<int:pk>/', PetShelterDetailView.as_view()),
    path('petshelter/<int:pk>/', PetShelterUpdateView.as_view()),
    path('petseeker/<int:pk>/', PetSeekerUpdateView.as_view()),
    # path('petseeker/detail/<int:pk>/', PetSeekerDetailView.as_view()),
]