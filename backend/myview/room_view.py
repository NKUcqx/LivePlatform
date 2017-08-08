from django.http import HttpResponse,JsonResponse
from backend.models import User,LiveRoom,Punishment
from django.forms.models import model_to_dict
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
    rooms_dic = rooms.values('id', 'name', 'creater', 'audience_amount', 'create_time', 'end_time', 'slide_path', 'thumbnail_path', 'is_living');
    for item in rooms_dic:
        item['creater_name'] = User.objects.get(id = item['creater']).nickname
        item['create_time'] = item['create_time'].strftime('%Y-%-m-%d %H:%m:%S')
        item['end_time'] = item['end_time'].strftime('%Y-%-m-%d %H:%m:%S') if item.get('end_time',None) is not None else ''
    return JsonResponse({"rooms": list(rooms_dic)})

def createRoomPath():
    now = timezone.now()
    now = now.strftime('%Y%M%d%H%m%S') + str(random.uniform(0,10))
    md5 = hashlib.md5()   
    md5.update(now.encode('utf-8'))   
    return md5.hexdigest()

def createFolder(file_name):
    os.makedirs(os.path.join('files/' , file_name))
    os.mknod(os.path.join('files/',file_name,'chatlog.txt'))

def uploadThumbnail(room, thumbnail):
    room.thumbnail_path = thumbnail
    room.save()
    return room

def uploadSlide(room, slide):
    room.slide_path = slide
    room.save()
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
                return HttpResponse(content = CODE['20'], status = 415)
        if(slide):
            slide_type = os.path.splitext(slide.name)[1]
            #must add dot ! otherwise user could upload file "somepdf" instead "some.pdf"  #any type else ?
            if(slide_type.endswith(('.ppt','.pptx','.pps','.swf','.pdf','.key'))):
                room = uploadSlide(room, slide)
                #room.slide_path = slide
            else:
                return HttpResponse(content = CODE['20'], status = 415)
        room.save()
        request.session['room'] = room
        return JsonResponse({'room': model_to_dict(room) }) # return the new room's id
    elif(request.user.role == 'S'):
        return HttpResponse(content = CODE['12'], status = 401)
    elif('room' in request.session):#because each person can not create other rooms while living
        return HttpResponse(content = CODE['21'], status = 400)
    else:
        return HttpResponse(content = CODE['12'], status = 401)

@require_POST
def endRoom(request):
    user = request.user# session need save a user entity & a room entity
    room = request.session.get('room',None)
    if(room):
        # _id is a default field to save one query from user table
        if(user and user.is_authenticated() and user.id == room.creater_id):
            room.end_time = timezone.now()
            room.is_living = False
            room.save()
            del request.session['room']
                #LOG("CQX-room_view.endRoom" , "Room: " + str(room.id) +"has been closed")
            return HttpResponse(content = CODE['0'])
        else :
            return HttpResponse(content = CODE['12'], status = 401)
    else:
        return HttpResponse(content = CODE['24'], status = 404)

