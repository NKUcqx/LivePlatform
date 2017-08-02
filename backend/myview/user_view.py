from django.http import HttpResponse
from django.forms.models import model_to_dict
from dwebsocket.decorators import accept_websocket,require_websocket
from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth
from random import Random
from django.core.mail import send_mail
from . import toolkits
from backend.models import User
from backend.forms import UserForm

import json
import re
# Create your views here.

CODE = toolkits.CODE
bi2obj = toolkits.bi2obj

#生成随机字段
def random_str(randomlength=4):  
    str=''  
    chars='1234567890'  
    length=len(chars)-1  
    random=Random()  
    for i in range(randomlength):  
        str+=chars[random.randint(0,length)]  
    return str

#检测邮箱是否有效
def test_email(email):
    if len(email)>= 5:
        if re.match("[a-zA-Z0-9]+\@+[a-zA-Z0-9]+\.+[a-zA-Z]",email) !=None:
            return True
    return False
def test_phone(phone):
    model=re.compile('^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}')
    phonematch=model.match(phone)
    return True if phonematch else False
#发送邮件
def send_to(request):
    email = request.GET.get('email')
    if(test_email(email)):
        try:
            message=u"您的注册码为"+random_str()
            send_mail(u'注册用户验证信息', message, '15302178925@163.com', [email], fail_silently=False) 
            return HttpResponse(CODE['0'])
        except:
            return HttpResponse(CODE['1'])
    else:
        return HttpResponse(CODE['10'])

#注册执行的函数，接收GET请求，返回字符串
#注册执行的函数，接收GET请求，返回字符串
def signup_submit(request):
    body = bi2obj(request)

    '''if(test_email(body['username'])):
        body['email'] = body['username']
    elif(test_phone(body['username'])):
        body['phone'] = body['username']
    else:
        return HttpResponse(CODE['4'])'''

    form = UserForm(body)
    if(form.is_valid()):
        form.save(commit = False)
        user = User.objects.create_user(
            username = form.username,
            password = form.password, 
            gender = form.gender, 
            email = form.username if test_email(form.username) else '', 
            phone = form.username if test_phone(form.username) else ''
        )
        #form.save(commit = False)
        user.save()
        return HttpResponse(model_to_dict(user))
    else:
        return HttpResponse(CODE['4'])


#登录执行的函数，接收POST请求，返回字符串，注意@csrf_exempt目前来说必不可少
#@csrf_exempt
def login_submit(request):
    body = bi2obj(request)
    user = auth.authenticate(request, username = body['username'], password = body['password'])
    if(user is not None):
        auth.login(request , user)
    else:
        return HttpResponse(CODE['11'])



'''      
    if not user:
        return HttpResponse("login failure")
    auth.login(request, user)
    return HttpResponse("login success")'''


'''
#查找用户名是否存在函数，接收GET请求，返回字符串
def query_repeat_username(request):
    get_username = request.GET.get('reusername')
    print(get_username)
    try:
        has_email = User.objects.get(username=get_username)
        if(has_email):
            return HttpResponse("username repeat")          
    except:
        return HttpResponse("username is ok") 

#向一个TEST表中写入数据，通过django的form形式，比较简单，注意forms.py这个文件
def insert(request):
    params = request.POST if request.method == 'POST' else None
    form = PostForm(params)
    if form.is_valid():
        form.save()
        return HttpResponse("insert success")
    return HttpResponse("insert failure")

#websocket的服务器端，接收消息返回消息
@require_websocket
def websocket(request):
    for message in request.websocket:
        params = {'content' :message.decode(encoding='utf-8')}
        form = TestForm(params)
        if form.is_valid():
            form.save()
            request.websocket.send("insert success: ".encode(encoding='utf-8') + message)
        else:
            request.websocket.send("insert failure: ".encode(encoding='utf-8') + message)'''