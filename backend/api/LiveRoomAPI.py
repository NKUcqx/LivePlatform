from backend.models import LiveRoom
from django.db.models import Count
from django.db.models import Avg
from django.db.models import Sum
'''
    name = models.CharField(max_length = 30)# ,db_index = True
    creater = models.ForeignKey(User, default = get_User)#no need to CASCADE when user get deleted ,right?
    audience_amount = models.PositiveIntegerField(default = 0)#present live audience amount if is_living = True else total amount
    is_living = models.BooleanField(default = True)
    create_time = models.DateTimeField(default= timezone.now)
    end_time = models.DateTimeField(null = True,blank = True) # identified whether it's A Live or not by whether end_time is null
    slide_path = models.FileField(upload_to = get_file_path ,default = 'default')
'''
def createRoom(**args):
    room = LiveRoom(name = args.get('name') , creater_id = 1)
    room.save()
#os.environ.update({"DJANGO_SETTINGS_MODULE":"mysite.settings"})
#import django
#django.setup()

def selectRoom(**args):#only(args.get('fields',{'*'})).
    rooms = LiveRoom.objects.select_related('creater').order_by( args.get('order_by','-audience_amount') )
    #try:
        #if(args.has_keys('name')):
    rooms = rooms.filter(name__contains = args.get('name',''))
    if('id' in args):
        rooms = rooms.filter(pk = args.get('id')) #primary key
    if('creater_id' in args):
        rooms = rooms.filter(creater_id = args.get('creater_id',''))#creater entity's id property
    #if(args.has_keys('creater_username')):
        #rooms = rooms.filter(creater_username = args.get('creater_username'))
    if('is_living' in args):
        rooms = rooms.filter(is_living = args.get('is_living'))
    #if(args.has_keys('amount_from')):
    rooms = rooms.filter(audience_amount__gte = args.get('amount_from',0))#>=
    if('amount_to' in args):
        rooms = rooms.filter(audience_amount__lte = args.get('amount-to'))#<=
    if('create_from' in args):
        rooms = rooms.filter(create_time__gte = args.get('create_from'))
    if('create_to' in args):
        rooms = rooms.filter(create_time__lte = args.get('create_to'))
    if('end_from' in args):
        rooms = rooms.filter(create_time__gte = args.get('create_from'))
    if('end_to' in args):
        rooms = rooms.filter(create_time__lte = args.get('create_to'))
    if('count' in args):
        rooms = rooms.annotate(count = Count(args.get('count','*')))
    if('average' in args):
        rooms = rooms.annotate(avg = Avg(args.get('avg')))
    if('sum' in args):
        rooms = rooms.annotate(sum = Sum(args.get('sum')))
    #except BaseException:
        #args type error?
       # print(BaseException)
    return rooms

def deleteRoom(**args):
    rooms = selectRoom(args)
    rooms.delete()

def updateRoom(**args):
    if('values' in args): #new values in dic form
        rooms = selectRoom(args.get('filter',{})) # get specified data or the whole bunch
        rooms.update(args.get('values'))
        rooms.save()

