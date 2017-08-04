from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings
import os
import hashlib
import random
# Create your models here.

def get_User():
    return User.objects.get(id=1)

def get_Room():
    return LiveRoom.objects.get(id= 1)# default value , use it instead of using "default = 1"

def get_file_path(instance,filename):
    return '/'.join((str(instance.file_name),filename))

def get_dir_path(instance = None):
    now = timezone.now()
    now = now.strftime('%Y%M%d%H%m%S') + str(random.uniform(0,10))
    md5 = hashlib.md5()   
    md5.update(now.encode('utf-8'))   
    return os.path.join('files',str(md5.hexdigest()))

class Test(models.Model):
	content = models.TextField()

class User(AbstractUser):
    phone = models.CharField(unique = True, max_length=11,blank = False )
    nickname = models.CharField(max_length = 30)
    date_joined = models.DateTimeField(auto_now_add = True, verbose_name = 'date joined')
    gender = models.BooleanField(default = True)
    avatar = models.FileField(upload_to = 'avatar/',default = 'default.jpg') # create a personal folder to hold resources later by DB or Django
    role_choices = (
        ('T','teacher'),
        ('S','student')
    )
    role = models.CharField(
        max_length = 7,
        choices = role_choices,
        default = 'S'
    )
    def __unicode__(self):
        return "ID : {}, UserName: {}".format(self.ID,self.username)

class LiveRoomManager(models.Manager):
    def room_count(self):
        return self.count()
    def room_creater_count(self,creater_id):
        return self.filter(creater_id = creater_id).count()
    def room_audience_count(self, amount_to, amount_from = 0):
        return self.filter(audience_amount__gte = amount_from,audience_amount__lte = amount_to).count()
    def room_living_count(self,is_living):
        return self.filter(is_living = is_living).count()
    def audience_count(self,room_id):
        return self.get(id = room_id).audience_amount
    '''def room_name_contains(self,name):
        return self.filter(name__icontains = name)
    def room_'''




class LiveRoom(models.Model):
    name = models.CharField(max_length = 30)# ,db_index = True
    creater = models.ForeignKey(User, default = get_User)#no need to CASCADE when user get deleted ,right?
    audience_amount = models.PositiveIntegerField(default = 0)#present live audience amount if is_living = True else total amount
    is_living = models.BooleanField(default = True)
    create_time = models.DateTimeField(auto_now_add = True)
    end_time = models.DateTimeField(null = True,blank = True) # identified whether it's A Live or not by whether end_time is null
    file_name = models.CharField(max_length = 50,default = get_dir_path)
    slide_path = models.FileField(upload_to = get_file_path ,default = 'default')
    thumbnail_path = models.ImageField(upload_to = get_file_path, default = 'default_thumbnail.jpg')
    objects = LiveRoomManager()
    def __unicode__(self):
        return "ID : {}, RoomName: {} , Creater: {}".format(self.ID,self.name,self.creater)

class Punishment(models.Model):
    room = models.ForeignKey(LiveRoom, default = get_Room, on_delete = models.CASCADE)
    user = models.ForeignKey(User, default = get_User ,on_delete = models.CASCADE)
    punishment_choice = (
        ('K','kicked out'),
        ('S','can not speak')
    )
    punishment = models.CharField(
        max_length=20,
        choices = punishment_choice,
        default = 'S'
    )