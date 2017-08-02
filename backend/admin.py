from django.contrib import admin
from .models import User,LiveRoom,Punishment
# Register your models here.

admin.site.register(User)
admin.site.register(LiveRoom)
admin.site.register(Punishment)
