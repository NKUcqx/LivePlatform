from backend.models import LiveRoom
from django.db.models import Count
from django.db.models import Avg
from django.db.models import Sum


def createRoom(**args):
    if 'name' in args:
        room = LiveRoom(
            name=args.get('name'),
            is_living=args.get('is_living', True),
            slide_path=args.get('slide_path', 'default'),
            thumbnail_path=args.get('thumbnail_path', 'default_thumbnail.jpg'))
    if 'creater_id' in args:
        room.creater_id = args.get('creater_id')
    elif 'creater' in args:
        room.creater = args.get('creater')
    else:
        return 0
    room.save()
    return room.id


# os.environ.update({"DJANGO_SETTINGS_MODULE":"mysite.settings"})
#import django
# django.setup()


def selectRooms(**args):  # only(args.get('fields',{'*'})).
    rooms = LiveRoom.objects.select_related('creater').order_by(
        args.get('order_by', '-audience_amount'))
    # try:
    # if(args.has_keys('name')):
    rooms = rooms.filter(name__contains=args.get('name', ''))
    if 'id' in args:
        rooms = rooms.filter(pk=args.get('id'))  # primary key
    if 'creater_id' in args:
        rooms = rooms.filter(creater_id=args.get(
            'creater_id', ''))  # creater entity's id property
    if 'creater' in args:
        rooms = rooms.filter(creater=args.get('creater'))
    # if(args.has_keys('creater_username')):
    #rooms = rooms.filter(creater_username = args.get('creater_username'))
    if 'is_living' in args:
        rooms = rooms.filter(is_living=args.get('is_living'))
    # if(args.has_keys('amount_from')):
    rooms = rooms.filter(audience_amount__gte=args.get('amount_from', 0))  # >=
    if 'amount_to' in args:
        rooms = rooms.filter(audience_amount__lte=args.get('amount-to'))  # <=
    if 'create_from' in args:
        rooms = rooms.filter(create_time__gte=args.get('create_from'))
    if 'create_to' in args:
        rooms = rooms.filter(create_time__lte=args.get('create_to'))
    if 'end_from' in args:
        rooms = rooms.filter(create_time__gte=args.get('create_from'))
    if 'end_to' in args:
        rooms = rooms.filter(create_time__lte=args.get('create_to'))
    # count func has been transfered to LiveRoomManager
    '''if('average' in args):
        rooms = rooms.annotate(average = Avg(args.get('avg')))
    if('sum' in args):
        rooms = rooms.annotate(sum = Sum(args.get('sum')))'''
    # except BaseException:
    # args type error?
    # print(BaseException)
    return rooms if len(rooms) > 1 else rooms[0]


'''
def deleteRoom(rooms):
    return rooms.delete()[0] # effected notes amount include notes cascaded in punishment table'''


def updateRoom(rooms, **args):
    room = rooms[0]  # update single note once ,for safe sake
    # room.
    if 'values' in args:  # new values in dic form
        rooms = selectRoom(args.get(
            'filter', {}))  # get specified data or the whole bunch
        rooms.update(args.get('values'))
        rooms.save()
