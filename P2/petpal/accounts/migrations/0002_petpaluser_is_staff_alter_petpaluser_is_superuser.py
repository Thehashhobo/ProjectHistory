# Generated by Django 4.2.7 on 2023-11-15 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='petpaluser',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='petpaluser',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]
