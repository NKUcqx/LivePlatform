from backend.models import LiveRoom
'''
name = models.CharField(max_length = 30)# ,db_index = True
    creater = models.ForeignKey(User, default = get_User)#no need to CASCADE when user get deleted ,right?
    audience_amount = models.PositiveIntegerField(default = 0)#present live audience amount if is_living = True else total amount
    is_living = models.BooleanField(default = True)
    create_time = models.DateTimeField(default= timezone.now)
    end_time = models.DateTimeField(null = True,blank = True) # identified whether it's A Live or not by whether end_time is null
    slide_path = models.FileField(upload_to = get_file_path ,default = 'default')
'''
def selectRoom(**args):
    rooms = LiveRoom.objects.order_by( args.get('order_by') if args.has_keys('order_by') else 'audience_amount' )
    try:
        if(args.has_keys('id')):
            rooms = rooms.filter(pk = args.get('id')) #primary key

        if(args.has_keys('creater_id')):
            rooms = rooms.filter(creater_id = args.get('creater_id'))#creater entity's id property

        if(args.has_keys('amount_from')):
            rooms = rooms.filter(audience_amount__gte = args.get('amount_from'))#>=

        if(args.has_keys('amount_to')):
            rooms = rooms.filter(audience_amount__lte = args.get('amount-to'))#<=

        if(args.has_keys('is_living')):
            rooms = rooms.filter(is_living = args.get('is_living'))

        if(args.has_keys('create_from')):
            rooms = rooms.filter(create_time__gte = args.get('create_from'))
        if(args.has_keys('create_to')):
            rooms = rooms.filter(create_time__lte = args.get('create_to'))
        if(args.has_keys('end_from')):
            rooms = rooms.filter(create_time__gte = args.get('create_from'))
        if(args.has_keys('end_to')):
            rooms = rooms.filter(create_time__lte = args.get('create_to'))
    except:
        #args type error?
        print("error")
    return rooms

