from django.shortcuts import render
from dwebsocket.decorators import accept_websocket, require_websocket
from . import toolkits
import json
from django.http import HttpResponse, JsonResponse
from backend.models import User, LiveRoom, Punishment
CODE = toolkits.CODE  # assign to local name to reduce the usage of its long prefix
bi2obj = toolkits.bi2obj
# change ImageFieldFile or some other field type into str for JsonResponse
model_to_json = toolkits.model_to_json


def echo(request):
    get_userid = request.GET.get('username')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    user = User.objects.get(id=get_userid)
    if room.is_silence == True:
        return HttpResponse('allsilence')
    else:
        punishment = Punishment.objects.filter(
            room=room, user=user, punishment='S')
        if len(punishment) > 0:
            return HttpResponse('banone')
        else:
            return HttpResponse('free')


def banpublic(request):
    print('--banpulic--')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    room.is_silence = True
    room.save()
    return HttpResponse('success')


def canpublic(request):
    print('--canpublic--')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    room.is_silence = False
    room.save()
    return HttpResponse('success')


def outone(request):
    print('--outone--')
    get_userid = request.GET.get('username')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    user = User.objects.get(id=get_userid)
    new_punishment = Punishment(room=room, user=user, punishment='K')
    new_punishment.save()
    return HttpResponse('success')


def banone(request):
    print('--banone--')
    get_userid = request.GET.get('username')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    user = User.objects.get(id=get_userid)
    new_punishment = Punishment(room=room, user=user, punishment='S')
    new_punishment.save()
    return HttpResponse('success')


def canspeakone(request):
    print('--canspeakone--')
    get_userid = request.GET.get('username')
    get_roomid = request.GET.get('roomid')
    room = LiveRoom.objects.get(id=get_roomid)
    user = User.objects.get(id=get_userid)
    punishment = Punishment.objects.get(room=room, user=user, punishment='S')
    punishment.delete()
    return HttpResponse('success')
