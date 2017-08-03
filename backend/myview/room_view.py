from django.http import HttpResponse
from django.utils import timezone # put it into toolkits?
from backend.models import User,LiveRoom,Punishment
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
#from django.contrib.auth.decorators import login_required 
from . import toolkits
import os

CODE = toolkits.CODE #assign to local name to reduce the usage of its long prefix
bi2obj = toolkits.bi2obj
LOG = toolkits.Log

'''
def createDir(room_id):#db will do this automaticlly
    path = os.path.join(os.getcwd(),'files',str(room_id))
    os.makedirs(path)
    return room_id'''

def gerRooms(request):
    rooms = LiveRoom.objects.order_by(request.GET.get('order_by','-audience_amount'))
    if('creater_id' in request.GET):
        rooms = rooms.filter(creater_id = request.GET.get('creater_id'))
    if('is_living' in request.GET):
        rooms = rooms.filter(is_living = request.GET.get('is_living'))
    if('limit' in request.GET):
        rooms = rooms[request.GET.get('start',0):request.GET.get('limit')]
    return rooms.values()

#@login_required #will jump to settings.LOGIN_URL automatically when user hasn't log in (we need control redirect within frontend so..)
@require_POST
def createRoom(request):
    #creater_id = request.session.get('_auth_user_id',None)# will be elimated by django when user log out 
    creater_id = 1# temporary
    if(creater_id):# can check log in status because of comments above
        thumbnail = request.FILES.get('thumbnail',None)
        slide = request.FILES.get('slide',None)
        name = request.POST.get('name')
        room = LiveRoom(name = name, creater_id = creater_id)
        if(thumbnail):
            thumbnail_type = os.path.splitext(thumbnail.name)[1]
            if(thumbnail_type.endswith(('.jpg','.png','.jpeg','.gif'))):
                room.thumbnail_path = thumbnail
                print(type(room.thumbnail_path))
            else:
                return HttpResponse(CODE['20'])
        if(slide):
            slide_type = os.path.splitext(slide.name)[1]
            if(slide_type.endswith(('.ppt','.pptx','.pps'))):#any type else ?
                room.slide_path = slide
            else:
                return HttpResponse(CODE['20'])
        room.save()
        return HttpResponse(room.id) # return the new room's id
    else:
        return HttpResponse(CODE['12'])

@require_POST
def endRoom(request):
    body = bi2obj(request)
   # user = request.session['user']# session need save a user entity & a room entity
    #room = request.session['room']
    session_user = { 'id': 1 }
    session_room = { 'id': 1 }
    request.session['user'] = session_user
    request.session['room'] = session_room
    if('user' in request.session):
        user = request.session['user']
        if('room' in request.session):
            rooms = LiveRoom.objects.filter(id = session_room['id'])
            if(len(rooms) > 0):
                room = rooms[0]
                if(room.creater_id == user['id']):#creater_id : a way to save one query.  must end it by the creater !
                    room.end_time = timezone.now()
                    room.is_living = False
                    room.save()
                    LOG("CQX-room_view.endRoom" , "Room: " + str(room.id) +"has been closed")
                    return HttpResponse(CODE['0'])
                else:
                    return HttpResponse(CODE['12'])
            else :
                return HttpResponse(CODE['6'])
            
        else:
            return HttpResponse(CODE['7'])
    else :
        return HttpResponse(CODE['12'])


