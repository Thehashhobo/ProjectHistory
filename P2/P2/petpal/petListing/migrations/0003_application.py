# Generated by Django 4.2.7 on 2023-11-15 03:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('petListing', '0002_petlisting_shelter'),
    ]

    operations = [
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
