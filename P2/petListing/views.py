from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters, permissions
from rest_framework.generics import ListAPIView
from .models import PetListing
from .serializer import PetListingSerializer, PetListingSummarySerializer, PetListingUpdateSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from accounts.models import PetShelter


class IsSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow SheltersManagers to create a listing.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_pet_shelter
    
class IsOwnerOrSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or SheltersManagers to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the object
        return obj.shelter.user == request.user



class PetListingCreate(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSheltersManager]
    def post(self, request, pk):
        pet_shelter = get_object_or_404(PetShelter, pk=pk)
        new_data = request.data.copy()
        new_data['shelter'] = pet_shelter.id
        serializer = PetListingSerializer(data=new_data)
        if serializer.is_valid():
            avatar_file = request.FILES.get('avatar')
            pet_listing_data = serializer.validated_data
            if avatar_file:
                pet_listing_data['avatar'] = avatar_file
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PetListingList(ListAPIView):
    # authentication_classes = [JWTAuthentication]
    queryset = PetListing.objects.all()
    serializer_class = PetListingSummarySerializer
    pagination_class = PageNumberPagination
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'age', 'size','shelter', 'gender']
    ordering_fields = ['age', 'size']
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    
class PetListingUpdate(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSheltersManager, IsOwnerOrSheltersManager]
    def put(self, request, pk):
        petlisting = get_object_or_404(PetListing, pk=pk)
        serializer = PetListingUpdateSerializer(petlisting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # can change to no pr

class PetListingDelete(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsSheltersManager, IsOwnerOrSheltersManager]
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

