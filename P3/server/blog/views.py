from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework import generics
from .models import Blog
from . serializer import BlogSerializer, UpdateSerializer
# from .serializer import 
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class BlogListCreateView(generics.GenericAPIView):
    pagination_class = [PageNumberPagination]
    authentication_classes = [JWTAuthentication]
    queryset = Blog.objects.all()
    filter_backends = [OrderingFilter]
    ordering_fields = ['date_posted', 'likes']
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return []
        return [IsAuthenticated()] # for creation

class BlogUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = UpdateSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        # Assuming 'likes' is a field you want to increment
        instance = serializer.instance
        instance.likes += 1
        instance.save()


