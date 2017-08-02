from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, UserManager
# Create your models here.

def get_User():
    return User.objects.get(id=1)

def get_Room():
    return LiveRoom.objects.get(id= 1)# default value , use it instead of using "default = 1"

def get_file_path(instance,filename):
    return 'room_{0}/{1}'.format(instance.id,filename) #automatically create a chat.log in this folder?


class Test(models.Model):
	content = models.TextField()

class User(AbstractUser):
    phone = models.CharField(unique = True, max_length=11,blank = False )
    nickname = models.CharField(max_length = 30)
    '''gender_choices = (
        (male, 'male'),
        (female, 'female')
    )
    gender = models.CharField(
        max_lenth = 6,
        choices = gender_choices,
        default = male
    )'''
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
class LiveRoom(models.Model):
    name = models.CharField(max_length = 30)# ,db_index = True
    creater = models.ForeignKey(User, default = get_User)#no need to CASCADE when user get deleted ,right?
    audience_amount = models.PositiveIntegerField(default = 0)#present live audience amount if is_living = True else total amount
    is_living = models.BooleanField(default = True)
    create_time = models.DateTimeField(default= timezone.now)
    end_time = models.DateTimeField(null = True,blank = True) # identified whether it's A Live or not by whether end_time is null
    slide_path = models.FileField(upload_to = get_file_path ,default = 'default')
    thumbnail_path = models.FileField(upload_to = get_file_path, default = 'default_thumbnail.jpg')
    def __unicode__(self):
        return "ID : {}, RoomName: {} , Creater: {}".format(self.ID,self.name,self.creater)

class Punishment(models.Model):
    room = models.ForeignKey(LiveRoom, default = get_Room, on_delete=models.CASCADE)
    user = models.ForeignKey(User, default = get_User ,on_delete=models.CASCADE)
    punishment_choice = (
        ('K','kicked out'),
        ('S','can not speak')
    )
    punishment = models.CharField(
        max_length=20,
        choices = punishment_choice,
        default = 'S'
    )