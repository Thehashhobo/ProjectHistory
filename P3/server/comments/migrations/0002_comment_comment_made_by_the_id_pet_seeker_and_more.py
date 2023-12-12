# Generated by Django 4.2.7 on 2023-12-09 17:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='comment_made_by_the_id_pet_seeker',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.petseeker'),
        ),
        migrations.AddField(
            model_name='comment',
            name='comment_made_by_the_id_pet_shelter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.petshelter'),
        ),
        migrations.AddField(
            model_name='comment',
            name='is_application',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='comment',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='rating',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
