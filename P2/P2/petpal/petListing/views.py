from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters, permissions, serializers
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, UpdateAPIView
from .models import PetListing, Application
from .serializer import PetListingSerializer, ApplicationSerializer, ApplicationUpdateSerializer
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated


class IsSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow SheltersManagers to create a listing.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_pet_shelter


class PetListingCreate(APIView):
    permission_classes = [IsSheltersManager]
    def post(self, request):
        serializer = PetListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PetListingList(ListAPIView):
    queryset = PetListing.objects.all()
    serializer_class = PetListingSerializer
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    #filterset_fields = ['status', 'age', 'size','shelter', 'gender']
    filterset_fields = ['status', 'age', 'size', 'gender']
    ordering_fields = ['age', 'size']
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    
class PetListingUpdate(APIView):
    def put(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        current_user = petlisting.shelter
        if current_user == request.user:
            serializer = PetListingSerializer(petlisting, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # can change to no pr

class PetListingDelete(APIView):
    def delete(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        petlisting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# class PetListingSearch(APIView):
#     def get(self, request):
#         queryset = PetListing.objects.all()
#         shelter = request.query_params.get('shelter')
#         status = request.query_params.get('status', 'available')
#         if shelter:
#             queryset = queryset.filter(shelter=shelter)
#         if status:
#             queryset = queryset.filter(status=status)
#         # Add more filters as needed
#         serializer = PetListingSerializer(queryset, many=True)
#         return Response(serializer.data)


##################### Application Views #####################

class CreateApplication(ListCreateAPIView):
    serializer_class = ApplicationSerializer
    # attribute: filter backends used for filtering/ordering the queryset
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['creation_time', 'last_update_time']
   
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pet_listing = get_object_or_404(PetListing, pk=self.kwargs['pk'], status='available')
         # Check if the user has already applied for this listing
        existing_application = Application.objects.filter(
            pet_seeker=self.request.user,
            pet_listing=pet_listing
        ).exists()

        if self.request.user.is_pet_shelter:
            raise PermissionDenied(detail="Shelters cannot create applications.")

        if existing_application:
            raise serializers.ValidationError("You have already applied for this listing.")

        serializer.save(pet_listing=pet_listing, pet_seeker=self.request.user)
    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(pet_seeker=user)

# Change this
class UpdateApplication(UpdateAPIView):
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        user = self.request.user
        
        # Shelter can only update the status of an application from pending to accepted or denied.
        # Pet seeker can only update the status of an application from pending or accepted to withdrawn.
        # Details of an application cannot be updated once submitted/created, except for its status

        if user.is_pet_seeker:
            if application.status not in ['pending', 'accepted'] or self.request.data.get('status') not in ['withdrawn']:
                raise PermissionDenied("Illegal action: as a pet seeker you can only update the status of an application from pending or accepted to withdrawn.")
        else: # user.is_pet_shelter:
            if application.status not in ['pending'] or self.request.data.get('status') not in ['accepted', 'denied']:
                raise PermissionDenied("Illegal action: as a shelter you can only update the status from pending to accepted or denied.")
        return application

    def perform_update(self, serializer):
        super().perform_update(serializer)

class GetApplication(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        application = get_object_or_404(Application, id=self.kwargs['pk'])

        # Ensure that the user is authorized to view the application
        if not (user.is_pet_shelter and application.pet_listing.shelter == user) and not (
                user.is_pet_seeker and application.pet_seeker == user):
            raise PermissionDenied("You are not authorized to view this application.")

        return application
