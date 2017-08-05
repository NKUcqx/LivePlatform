from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.conf import settings
from . import models


@receiver(pre_save, sender=settings.AUTH_USER_MODEL)
def create_profile_handler(sender, instance, created, **kwargs):
    