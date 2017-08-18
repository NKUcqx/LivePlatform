from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from backend.models import User, LiveRoom, Punishment
from django.forms.models import model_to_dict
from django.utils import timezone
from django.views.decorators.http import require_POST, require_GET
from . import toolkits
import os
import random
import hashlib
import zipfile
import cloudconvert
import threading
import time

CODE = toolkits.CODE  # assign to local name to reduce the usage of its long prefix
bi2obj = toolkits.bi2obj
# change ImageFieldFile or some other field type into str for JsonResponse
model_to_json = toolkits.model_to_json
API_key = [ # to get more free conversion chances ..
            '1ExrXf1WpChC9gvOxnzuR5_unapQx1RqigB4Kmyc-teB3tp8kSybrSU-nrcELHwJWYxljLt8euwJwtgFTrdFsQ',
            'LRxCwzT2-CLqFqr936dWjknyulqsjFtXVL1GQLcmJhsgG_Ad7503sH98cGcSvFhQe5pRUWmuR4tb448MvgarEg'
        ]
IMG_LIST = ('.jpg', '.jpeg' '.png', '.svg', '.gif')
SLIDE_LIST = ('.ppt', '.pptx', '.pps', '.pdf')
processes = {}  # converting process of cloudconvert, to check the status

#model_to_dict = toolkits.model_to_dict


def generate_room_path():
    now = timezone.now()
    now = now.strftime('%Y%M%d%H%m%S') + str(random.uniform(0, 10))
    md5 = hashlib.md5()
    md5.update(now.encode('utf-8'))
    name = md5.hexdigest()
    return os.path.join('frontend', 'static', 'rooms', name)


def create_folder(file_name):
    if (os.path.exists(file_name)):
        return False
    else:
        os.makedirs(file_name)
        os.mknod(os.path.join(file_name, 'log.txt'))
        return True


def upload_thumbnail(room_id, thumbnail):
    room = LiveRoom.objects.get(pk=room_id)
    room.thumbnail_path = thumbnail
    room.save()
    return room


def upload_slide(room_id, slide):
    room = LiveRoom.objects.get(pk=room_id)
    room.slide_path = slide
    room.save()  # save the .ppt
    # upload the slide and download the conversion to room.filename
    converted_file = convert_file(room.slide_path.name, room.id,
                                  room.file_name)
    unziped_file = un_zip(converted_file)
    room.slide_path = unziped_file
    room.save()
    return room


def check_convert_status(process_id):  # i.e. upload_to
    process = processes[process_id]
    process.refresh()
    process.wait()
    return process['message']


def convert_file(file, process_id, upload_to):
    # TODO: if(type(file) )
    file_handler = open(file, 'rb')
    api = cloudconvert.Api(API_key[0])  # TODO: random.randint(0,1)
    split_arr = os.path.splitext(file_handler.name)
    realname = split_arr[0].split('/')[-1]
    postfix = split_arr[1][1:]
    process = api.convert({
        'inputformat': postfix,
        'outputformat': 'jpg',  # TODO: will change to any type laterly 
        'input': 'upload',
        'filename': '%s.%s' % (realname, postfix),
        'file': file_handler
    })
    processes[process_id] = process
    process.wait()
    process.download(upload_to)
    #return upload_to + realname + '.zip' # TODO: So ugly..
    return '%s/%s.zip' % (upload_to, realname)


def un_zip(file_name):
    zip_file = zipfile.ZipFile(file_name)
    # file with postfix i.e. 'frontend/static/rooms/ertfhg3456yhj/slide (without .ppt)'
    split_str = os.path.splitext(file_name)[0]
    if not os.path.isdir(split_str):
        os.mkdir(split_str)
    zip_file.extractall(split_str)
    zip_file.close()
    return split_str


def change_prefix(long_path, add=False, target='static'):
    if (add):
        return '/' + os.path.join(target, long_path)
    try:
        path_arr = long_path.split('/')
        path = '/' + '/'.join(path_arr[path_arr.index(target):])
    except ValueError:
        return long_path
    return path


def wrap_room(room):  # room instance
    room = model_to_json(room)
    room['creator_id'] = room.get('creator', room.get('creator_id', None))
    room['creator_nickname'] = User.objects.get(
        pk=int(room['creator_id'])).nickname
    #room['create_time'] = room['create_time'].strftime('%Y-%-m-%d %H:%m:%S')
    #room['end_time'] = room['end_time'].strftime('%Y-%-m-%d %H:%m:%S') if room.get('end_time', None) is not None else ''
    room['file_name'] = change_prefix(room['file_name'])
    room['thumbnail_path'] = change_prefix(room['thumbnail_path'])
    room['slide_path'] = change_prefix(room['slide_path'])
    return room


@login_required
@require_GET
def getRooms(request):
    rooms = LiveRoom.objects.order_by(
        request.GET.get('order_by', '-audience_amount'))
    if ('id' in request.GET):
        rooms = rooms.filter(id=request.GET.get('id'))
    if ('creator_id' in request.GET):
        rooms = rooms.filter(creator_id=request.GET.get('creator_id'))
    if ('is_living' in request.GET):
        rooms = rooms.filter(is_living=True if
                             request.GET.get('is_living') == 'true' else False)
    if ('limit' in request.GET):
        start = int(request.GET.get('start', 0))
        limit = start + int(request.GET.get('limit'))
        rooms = rooms[start:limit]
    room_list = []
    for item in rooms:
        room_list.append(wrap_room(item))
    return JsonResponse({'rooms': room_list})


@login_required
@require_GET
def getRoomAmount(request):
    living_amount = LiveRoom.objects.room_living_count(is_living=True)
    end_amount = LiveRoom.objects.room_living_count(is_living=False)
    return JsonResponse({
        'living_amount': living_amount,
        'end_amount': end_amount
    })


@login_required
@require_POST
def uploadThumbnail(request):
    # must satisfy: login and is a teacher and has created a live room
    if ('room' in request.session):
        room = request.session['room']
        if (str(request.user.id) == room['creator_id']):
            thumbnail = request.FILES.get('thumbnail')
            thumbnail_type = os.path.splitext(thumbnail.name)[1]
            if (thumbnail_type in IMG_LIST):
                room = upload_thumbnail(room['id'], thumbnail)
                return JsonResponse({'room': wrap_room(room)})
            else:
                return HttpResponse(content=CODE['20'], status=415)
        else:
            return HttpResponse(content=CODE['12'], status=401)
    else:
        return HttpResponse(content=CODE['24'], status=400)


@login_required
@require_POST
def uploadSlide(request):
    if ('room' in request.session):
        room = request.session['room']
        if (str(request.user.id) == room['creator_id']):
            slide = request.FILES.get('slide', None)
            if (slide is not None):
                slide_type = os.path.splitext(slide.name)[1]
                # must add dot ! otherwise user could upload file like
                # "somepdf" instead of "some.pdf"  #any type else ?
                if (slide_type in SLIDE_LIST):
                    print('start uploading file: %s', slide.name)
                    room = upload_slide(room['id'], slide)
                    print('finish uploading .')
                    return JsonResponse({'room': wrap_room(room)})
                else:
                    return HttpResponse(content=CODE['20'], status=415)
            return HttpResponse(content=CODE[
                '5'])  # no changes, but it is nobody's fault, return 200
        else:
            return HttpResponse(content=CODE['12'], status=401)
    # because each person can not create other rooms while living
    else:
        return HttpResponse(content=CODE['24'], status=400)


@login_required
@require_GET
def getConvertStatus(request):
    if ('room' in request.session):
        room = request.session['room']
        message = check_convert_status(room['id'])
        return JsonResponse({'message': message})
    else:
        return HttpResponse(content=CODE['24'], status=400)


def videothread(k,roomname):
    print('video start')
    createtime=time.strftime('%Y%m%d', time.localtime(time.time()))
    os.system('backend/record/Recorder_local --appId "0c6a0a8f844c49d78a9aac0907dfc1d8" --uid 0 --channel '+ str(k) +' --appliteDir "backend/record/bin/" --channelProfile 1 --idle 120 --recordFileRootDir '+ 'frontend/static/record')
    print('video convert')
    os.system('python3.6 backend/record/video_convert.py '+ 'frontend/static/record' + '/' +createtime+ '/' + str(k) + '*')

@login_required
@require_POST
def createRoom(request):
    # can check log in status because of comments above
    if (request.user.role == 'T' and 'room' not in request.session):
        creator_id = request.user.id
        thumbnail = request.FILES.get('thumbnail', None)
        name = request.POST.get('name')
        is_silence = True if request.POST.get('is_silence',
                                              None) is not None else False
        is_living = False if request.POST.get('is_living',
                                              None) is not None else True
        file_name = generate_room_path()
        threads = []
        if (create_folder(file_name)):
            room = LiveRoom(
                name=name,
                creator_id=creator_id,
                file_name=file_name,
                is_silence=is_silence,
                is_living=is_living)
            room.save()
            k=room.id
            room = wrap_room(room)
            print('thread--start')
            t = threading.Thread(target=videothread,args=(k,room['file_name'],))
            threads.append(t)
            t.start()
            print('thread--real')
            request.session['room'] = room
            return JsonResponse({'room': room})  # return the new room's id
        else:
            return HttpResponse(content=CODE['6'], status=500)
    elif ('room' in request.session):
        # because each person can not create other rooms while living
        return HttpResponse(content=CODE['21'], status=400)
    else:
        return HttpResponse(content=CODE['12'], status=401)


@login_required
@require_POST
def updateRoom(request):
    user = request.user
    room = request.session.get('room', None)
    body = bi2obj(request)
    if (room and user and str(user.id) == room['creator_id']):
        room_db = LiveRoom.objects.get(pk=int(room['id']))
        new_amount = body.get('audience_amount', None)
        new_name = body.get('name', None)
        if (new_amount is not None and new_amount != ''):
            room_db.audience_amount = new_amount
        if (new_name is not None and new_name != ''):
            room_db.name = new_name
        room_db.save()
        room = wrap_room(room_db)
        request.session['room'] = room  # update session's room
        return JsonResponse({'room': room})
    else:
        return HttpResponse(content=CODE['12'], status=401)


@login_required
@require_POST
def endRoom(request):
    user = request.user
    room = request.session.get('room', None)
    if (room):
        if (user and str(user.id) == room['creator_id']):
            room_db = LiveRoom.objects.get(pk=int(room['id']))
            room_db.is_living = False  # will set end_time automatically by db
            room_db.save()
            del request.session['room']
            return HttpResponse(CODE['0'])
        else:
            return HttpResponse(content=CODE['12'], status=401)
    else:
        return HttpResponse(content=CODE['24'], status=404)


@login_required
@require_POST
def silenceRoom(request):
    body = bi2obj(request)
    user = request.user
    if (user.role == 'T' and 'room' in request.session
            and user.id == request.session.get('room').get('creator_id')):
        room = request.session.get('room')
        room_db = LiveRoom.objects.get(pk=int(room['id']))
        room_db.is_silence = body['is_silence']
        room_db.save()
        return JsonResponse(content=wrap_room(room_db))
    else:
        return HttpResponse(content=CODE['12'], status=401)
