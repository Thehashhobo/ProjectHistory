from django.db import models
from accounts.models import PetShelter

class PetListing(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
        ('unavailable', 'Unavailable'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('extra_large', 'Extra Large'),
    ]

    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    size = models.CharField(max_length=20, choices=SIZE_CHOICES)
    color = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available')
    description = models.TextField()
    shelter = models.ForeignKey(PetShelter, on_delete=models.CASCADE, related_name='pet_listings')
    date_posted = models.DateTimeField(auto_now_add=True)
    characteristics = models.CharField(max_length=255) # may need to be parsed later(or omit because we already meet requirments)
    avatar = models.ImageField(upload_to="avatar/", default=None, null=True)
    

    def __str__(self):
        return f"{self.name}"
