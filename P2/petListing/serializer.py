from rest_framework import serializers
from .models import PetListing
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField

# remeber to validate(method = validate)


class PetListingSerializer(serializers.ModelSerializer):
    PetListing = PrimaryKeyRelatedField(read_only=True)
    PetListing = DateTimeField(read_only=True) #may cause bug
    class Meta:
        model = PetListing
        fields = '__all__'

class PetListingUpdateSerializer(serializers.ModelSerializer):
    # Making fields optional
    status = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    characteristics = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)
    class Meta:
        model = PetListing
        fields = ['status','description', 'characteristics', 'avatar']
    
    def update(self, instance, validated_data):
        # Only update fields if they are present in the validated_data
        instance.status = validated_data.get('status', instance.status)
        instance.description = validated_data.get('description', instance.description)
        instance.characteristics = validated_data.get('characteristics', instance.characteristics)

        # Handling file field (avatar) separately
        if 'avatar' in validated_data:
            instance.avatar = validated_data.get('avatar')

        instance.save()
        return instance


class PetListingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['id', 'name', 'breed', 'age', 'size', 'status', 'avatar']
