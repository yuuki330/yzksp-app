# Generated by Django 3.2.25 on 2024-08-27 00:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yzkspApp', '0002_alter_event_organizer'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='eventType',
            field=models.CharField(choices=[('regular', '放課後練習'), ('weekend', '休日練習'), ('competition', '大会'), ('other', 'その他')], default='regular', max_length=20),
        ),
    ]
