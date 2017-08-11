from django.contrib.auth.decorators import login_required
from django.http import HttpResponse,JsonResponse
from backend.models import User,LiveRoom,Punishment
from django.forms.models import model_to_dict
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from . import toolkits
import os
import hashlib 
import random

CODE = toolkits.CODE #assign to local name to reduce the usage of its long prefix
bi2obj = toolkits.bi2obj
model_to_json = toolkits.model_to_json #change ImageFieldFile or some other field type into str for JsonResponse
#model_to_dict = toolkits.model_to_dict

def generate_room_path():
    now = timezone.now()
    now = now.strftime('%Y%M%d%H%m%S') + str(random.uniform(0,10))
    md5 = hashlib.md5()
    md5.update(now.encode('utf-8'))
    return md5.hexdigest()

def create_folder(file_name):
    if(os.path.exists(os.path.join('frontend/static/rooms/' , file_name))):
        return False
    else:
        os.makedirs(os.path.join('frontend/static/rooms/' , file_name))
        os.mknod(os.path.join('frontend/static/rooms/', file_name, 'log.txt'))
        return True

def upload_thumbnail(room_id, thumbnail):
    room = LiveRoom.objects.get(pk = room_id)
    room.thumbnail_path = thumbnail
    room.save()
    return room

def upload_slide(room_id, slide):
    room = LiveRoom.objects.get(pk = room_id)
    room.slide_path = slide
    room.save()
    return room

@login_required
@require_GET
def getRooms(request):
    rooms = LiveRoom.objects.order_by(request.GET.get('order_by','-audience_amount'))
    if('id' in request.GET):
        rooms = rooms.filter(id = request.GET.get('id'))
    if('creater_id' in request.GET):
        rooms = rooms.filter(creater_id = request.GET.get('creater_id'))
    if('is_living' in request.GET):
        rooms = rooms.filter(is_living = True if request.GET.get('is_living') == 'true' else False)
    if('limit' in request.GET):
        start = int(request.GET.get('start',0))
        limit = start + int(request.GET.get('limit'))
        rooms = rooms[start:limit]
    rooms_dict = rooms.values('id', 'name', 'file_name', 'creater', 'audience_amount', 'create_time', 'end_time', 'slide_path', 'thumbnail_path', 'is_living', 'is_silence');
    for item in rooms_dict:
        item['creater_name'] = User.objects.get(pk = int(item['creater'])).nickname
        item['create_time'] = item['create_time'].strftime('%Y-%-m-%d %H:%m:%S')
        item['end_time'] = item['end_time'].strftime('%Y-%-m-%d %H:%m:%S') if item.get('end_time',None) is not None else ''
    return JsonResponse({"rooms": list(rooms_dict)})

@login_required
@require_POST
def uploadThumbnail(request):
    #must satisfy: login and is a teacher and has created a live room
    if(request.user.role == 'T' and 'room' in request.session):
        room = upload_thumbnail(request.session.get('room').id, request.FILES.get('thumbnail'))
        return JsonResponse({'room':model_to_json(room)})
    elif('room' not in request.session):#because each person can not create other rooms while living
        return HttpResponse(content = CODE['24'], status = 400)
    else:
        return HttpResponse(content = CODE['12'], status = 401)

@login_required
@require_POST
def uploadSlide(request):
    if(request.user.role == 'T' and 'room' in request.session):
        room = upload_slide(request.session.get('room').id, request.FILES.get('slide'))
        return JsonResponse({'room':model_to_json(room)})
    elif('room' not in request.session):#because each person can not create other rooms while living
        return HttpResponse(content = CODE['24'], status = 400)
    else:
        return HttpResponse(content = CODE['12'], status = 401)

#TODO create error_log.txt
@login_required
@require_POST
def createRoom(request):
    if(request.user.role == 'T' and 'room' not in request.session):# can check log in status because of comments above
        creater_id = request.user.id
        thumbnail = request.FILES.get('thumbnail', None)
        slide = request.FILES.get('slide', None)
        name = request.POST.get('name')
        is_silence = True if request.POST.get('is_silence', None) is not None else False
        is_living = False if request.POST.get('is_living', None) is not None else True
        file_name = generate_room_path()
        if(create_folder(file_name)):
            room = LiveRoom(
                name = name,
                creater_id = creater_id,
                file_name = file_name,
                is_silence = is_silence,
                is_living = is_living
            )
            if(thumbnail):
                thumbnail_type = os.path.splitext(thumbnail.name)[1]
                if(thumbnail_type.endswith(('.jpg','.png','.jpeg','.gif'))):
                    room = upload_thumbnail(room , thumbnail)
                else:
                    return HttpResponse(content = CODE['20'], status = 415)
            if(slide):
                slide_type = os.path.splitext(slide.name)[1]
                #must add dot ! otherwise user could upload file like "somepdf" instead of "some.pdf"  #any type else ?
                if(slide_type.endswith(('.ppt','.pptx','.pps','.swf','.pdf','.key'))):
                    room = upload_slide(room, slide)
                else:
                    return HttpResponse(content = CODE['20'], status = 415)
            room.save()
            room = model_to_json(room)
            room['creater_nickname'] = User.objects.get(pk = room['creater']).nickname
            request.session['room'] = room
            return JsonResponse({'room': room}) # return the new room's id
        else:
            return HttpResponse(content = CODE['6'], status = 500)
    elif('room' in request.session):#because each person can not create other rooms while living
        return HttpResponse(content = CODE['21'], status = 400)
    else:
        return HttpResponse(content = CODE['12'], status = 401)

@login_required
@require_POST
def updateRoom(request):
    user = request.user
    room = request.session.get('room', None)
    body = bi2obj(request)
    if(room and user and str(user.id) == room['creater']):
        room_db = LiveRoom.objects.get(pk = int(room['id']))
        new_amount = body.get('audience_amount', None)
        new_name = body.get('name', None)
        if(new_amount is not None and new_amount != ''):
            room_db.audience_amount = new_amount
        if(new_name is not None and new_name != ''):
            room_db.name = new_name
        room_db.save()
        room = model_to_json(room_db)
        request.session['room'] = room #update session's room
        return JsonResponse({'room': room})
    else:
        return HttpResponse(content = CODE['12'], status = 401)

@login_required
@require_POST
def endRoom(request):
    user = request.user
    room = request.session.get('room',None)
    if(room):
        # _id is a default field add by Django (can save one query from user table)
        if(user and str(user.id) == room['creater']):
            room_db = LiveRoom.objects.get(pk = int(room['id']))
            room_db.is_living = False #will set end_time automatically by db
            room_db.save()
            del request.session['room']
            return HttpResponse(CODE['0'])
        else :
            return HttpResponse(content = CODE['12'], status = 401)
    else:
        return HttpResponse(content = CODE['24'], status = 404)

@login_required
@require_POST
def silenceRoom(request):
    body = bi2obj(request)
    user = request.user
    if(user.role == 'T' and 'room' in request.session and user.id == request.session.get('room').get('creater')):
        room = request.session.get('room')
        room_db = LiveRoom.objects.get(pk = int(room['id']))
        room_db.is_silence = body['is_silence']
        room_db.save()
        return JsonResponse(content = model_to_json(room_db))
    else:
        return HttpResponse(content = CODE['12'], status = 401)