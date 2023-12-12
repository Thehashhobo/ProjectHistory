# Generated by Django 4.2.7 on 2023-11-15 21:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PetListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('breed', models.CharField(max_length=100)),
                ('age', models.PositiveIntegerField()),
                ('size', models.CharField(choices=[('small', 'Small'), ('medium', 'Medium'), ('large', 'Large'), ('extra_large', 'Extra Large')], max_length=20)),
                ('color', models.CharField(max_length=50)),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=10)),
                ('status', models.CharField(choices=[('available', 'Available'), ('adopted', 'Adopted'), ('pending', 'Pending'), ('unavailable', 'Unavailable')], default='available', max_length=15)),
                ('description', models.TextField()),
                ('date_posted', models.DateTimeField(auto_now_add=True)),
                ('characteristics', models.CharField(max_length=255)),
                ('avatar', models.ImageField(default=None, null=True, upload_to='avatar/')),
                ('shelter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pet_listings', to='accounts.petshelter')),
            ],
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('denied', 'Denied'), ('withdrawn', 'Withdrawn')], default='pending', max_length=20)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_update_time', models.DateTimeField(auto_now=True)),
                ('seeker_home_type', models.CharField(max_length=100)),
                ('seeker_yard_size', models.CharField(max_length=100)),
                ('seeker_pet_care_experience', models.CharField(max_length=100)),
                ('seeker_previous_pets', models.CharField(max_length=100)),
                ('pet_listing', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='petListing.petlisting')),
                ('pet_seeker', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
