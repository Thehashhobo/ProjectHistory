from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.


from rest_framework import status
from rest_framework.views import APIView
from .models import PetPalUser, PetSeeker, PetShelter
from .serializers import PetSeekerSerializer, PetShelterSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView


# Create PetSeeker
class PetSeekerRegistrationView(APIView):
    def post(self, request, format=None):
        pet_seeker_serializer = PetSeekerSerializer(data = request.data)
        if pet_seeker_serializer.is_valid():
            if PetPalUser.objects.filter(email=request.data.get('email')).exists():
                return Response({"error": "An account is associated with this email already."}, status=status.HTTP_400_BAD_REQUEST) 
            avatar_file = request.FILES.get('avatar')
            pet_pal_user = PetPalUser.objects.create_user(email=request.data['email'], password=request.data['password'], is_pet_seeker=True)
            pet_seeker_data =pet_seeker_serializer.validated_data
            if avatar_file:
                pet_seeker_data['avatar'] = avatar_file
            pet_seeker = PetSeeker.objects.create(user=pet_pal_user, **pet_seeker_data)
            return Response(PetSeekerSerializer(pet_seeker).data, status=status.HTTP_201_CREATED)
        return Response(pet_seeker_serializer.errors, status=status.HTTP_400_BAD_REQUEST)    


# Create a PetShelter    
class PetShelterRegistrationView(APIView):
    def post(self, request, format=None):
        pet_shelter_serializer = PetShelterSerializer(data=request.data)
        if pet_shelter_serializer.is_valid():
            if PetPalUser.objects.filter(email=request.data.get('email')).exists():
                return Response({"error": "An account is associated with this email already."}, status=status.HTTP_400_BAD_REQUEST) 
            pet_pal_user = PetPalUser.objects.create_user(email=request.data['email'], password=request.data['password'], is_pet_shelter=True)
            pet_shelter = PetShelter.objects.create(user=pet_pal_user, **pet_shelter_serializer.validated_data)
            return Response(PetShelterSerializer(pet_shelter).data, status=status.HTTP_201_CREATED)
        return Response(pet_shelter_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

# List all PetShelters
class PetShelterListView(APIView):
    def get(self, request, format=None):
        pet_shelters = PetShelter.objects.all()
        pet_shelter_serializer = PetShelterSerializer(pet_shelters, many=True)
        return Response(pet_shelter_serializer.data)


# Update a PetShelter
class PetShelterUpdateView(APIView):
    def put(self, request, pk, format=None):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        pet_shelter_serializer = PetShelterSerializer(pet_shelter, data=request.data)

        if pet_shelter_serializer.is_valid():
            pet_shelter_serializer.save()
            return Response(pet_shelter_serializer.data)
        return Response(pet_shelter_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Update a PetSeeker
class PetSeekerUpdateView(APIView):
    def put(self, request, pk, format=None):
        pet_seeker = get_object_or_404(PetSeeker, pk=pk)
        pet_seeker_serializer = PetSeekerSerializer(pet_seeker, data=request.data)

        if pet_seeker_serializer.is_valid():
            pet_seeker_serializer.save()
            return Response(pet_seeker_serializer.data)
        return Response(pet_seeker_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View a PetShelter
class PetShelterDetailView(APIView):
    def get(self, request, pk, format=None):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        pet_shelter_serializer = PetShelterSerializer(pet_shelter)
        return Response(pet_shelter_serializer.data)