from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField
from .models import PetListing
from .models import Application

class PetListingSerializer(serializers.ModelSerializer):
    PetListing = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = PetListing
        fields = '__all__'
    
class PetListingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['id', 'name', 'breed', 'age', 'size', 'status']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'pet_seeker', 'pet_listing', 'creation_time', 'last_update_time', "seeker_home_type", "seeker_yard_size", "seeker_pet_care_experience",  "seeker_previous_pets") # can't update these fields