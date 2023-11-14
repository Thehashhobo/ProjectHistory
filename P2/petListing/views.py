from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters, permissions
from rest_framework.generics import ListAPIView
from .models import PetListing
from .serializer import PetListingSerializer
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend


class IsSheltersManager(permissions.BasePermission):
    """
    Custom permission to only allow SheltersManagers to create a listing.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_shelters_manager


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

