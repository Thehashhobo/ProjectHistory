from rest_framework import serializers
from .models import PetSeeker, PetShelter


class PetSeekerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = PetSeeker
        fields = ['id', 'user', 'name', 'avatar']


class PetShelterSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = PetShelter
        fields = ['id', 'user', 'name', 'mission_statement', 'address', 'phone_number']


    
