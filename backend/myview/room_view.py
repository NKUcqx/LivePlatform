from django.http import HttpResponse,JsonResponse
from django.utils import timezone # put it into toolkits?
from backend.models import User,LiveRoom,Punishment
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
#from django.contrib.auth.decorators import login_required 
from . import toolkits
import os
import hashlib 
import random

CODE = toolkits.CODE #assign to local name to reduce the usage of its long prefix
bi2obj = toolkits.bi2obj
LOG = toolkits.Log

'''
def createDir(room_id):#db will do this automaticlly
    path = os.path.join(os.getcwd(),'files',str(room_id))
    os.makedirs(path)
    return room_id'''

def getRooms(request):
    rooms = LiveRoom.objects.order_by(request.GET.get('order_by','-audience_amount'))
    if('creater_id' in request.GET):
        rooms = rooms.filter(creater_id = request.GET.get('creater_id'))
    if('is_living' in request.GET):
        rooms = rooms.filter(is_living = True if request.GET.get('is_living') == 'true' else False)
    if('limit' in request.GET):
        rooms = rooms[int(request.GET.get('start',0)):int(request.GET.get('limit'))]
    return JsonResponse({"rooms":list(rooms.values())})

def createRoomPath():
    now = timezone.now()
    now = now.strftime('%Y%M%d%H%m%S') + str(random.uniform(0,10))
    md5 = hashlib.md5()   
    md5.update(now.encode('utf-8'))   
    return md5.hexdigest()

def createFolder(file_name):
    os.makedirs( os.path.join('files/' , file_name) )
    os.mknod( os.path.join('files/',file_name,'chatlog.txt'))

def uploadThumbnail(room, thumbnail):
    room.thumbnail_path = thumbnail
    return room

def uploadSlide(room, slide):
    room.slide_path = slide
    return room

#TODO create error_log.txt

#@login_required #will jump to settings.LOGIN_URL automatically when user hasn't log in (we need control redirect within frontend so..)
@require_POST
def createRoom(request):
    if(request.user.is_authenticated() and request.user.role == 'T' and 'room' not in request.session):# can check log in status because of comments above
        creater_id = request.user.id
        thumbnail = request.FILES.get('thumbnail',None)
        slide = request.FILES.get('slide',None)
        name = request.POST.get('name')
        file_name = createRoomPath()
        createFolder(file_name)
        room = LiveRoom(name = name, creater_id = creater_id, file_name = file_name)
        if(thumbnail):
            thumbnail_type = os.path.splitext(thumbnail.name)[1]
            if(thumbnail_type.endswith(('.jpg','.png','.jpeg','.gif'))):
                #room.thumbnail_path = thumbnail
                room = uploadThumbnail(room , thumbnail)
                #print(type(room.thumbnail_path))
            else:
                return HttpResponse(CODE['20'])
        if(slide):
            slide_type = os.path.splitext(slide.name)[1]
            if(slide_type.endswith(('.ppt','.pptx','.pps','.swf','.pdf','.key'))):#must add dot ! otherwise user could upload file "somepdf" instead "some.pdf"  #any type else ?
                room = uploadSlide(room, slide)
                #room.slide_path = slide
            else:
                return HttpResponse(CODE['20'])
        room.save()
        request.session['room'] = room
        return HttpResponse(room) # return the new room's id
        
    elif(request.user.role == 'S'):
        return HttpResponse(CODE['12'])
    elif('room' in request.session):
        return HttpResponse(CODE['21'])
    else:
        return HttpResponse(CODE['12'])



@require_POST
def endRoom(request):
    user = request.user# session need save a user entity & a room entity
    room = request.session.get('room',None)
    if(room):
        if(user and user.is_authenticated() and user.role == 'T' and user.id == room.creater_id):# _id is a default field to save one query from user table                
            room.end_time = timezone.now()
            room.is_living = False
            room.save()
            del request.session['room']
                #LOG("CQX-room_view.endRoom" , "Room: " + str(room.id) +"has been closed")
            return HttpResponse(CODE['0'])
        else :
            return HttpResponse(CODE['12'])
    else:
        return HttpResponse(CODE['24'])


