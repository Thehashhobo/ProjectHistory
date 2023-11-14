from rest_framework import serializers
from .models import PetListing
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField

class PetListingSerializer(serializers.ModelSerializer):
    PetListing = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = PetListing
        fields = '__all__'
    
class PetListingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['id', 'name', 'breed', 'age', 'size', 'status']
