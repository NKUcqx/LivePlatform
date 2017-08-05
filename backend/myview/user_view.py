from django.http import HttpResponse
from django.forms.models import model_to_dict
from django.views.decorators.http import require_POST,require_GET
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

def change_avatar(request):
    user = User.object.get(id = request.user_id)
    avatar = request.FILES.get('avatar',None)
    if(avatar is not None):
        user.avatar_path = avatar
        user.save()
        return HttpResponse(CODE['0'])
    else:
        return HttpResponse(CODE['25'])

#发送邮件
@require_POST
def send_to(request):
    body = bi2obj(request)
    email = body['email']
    code = body['code']
    if(test_email(email)):
        try:
            message=u"您的注册码为"+str(code)
            send_mail(u'注册用户验证信息', message, '15302178925@163.com', [email], fail_silently=False) 
            return HttpResponse(CODE['0'])
        except:
            return HttpResponse(CODE['1'])
    else:
        return HttpResponse(CODE['10'])

#注册执行的函数，接收GET请求，返回字符串
@require_POST
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
        instance = form.save(commit = False)
        user = User.objects.create_user(
            username = instance.username,
            password = instance.password, 
            gender = instance.gender,
            nickname = instance.nickname, 
            email = instance.username if test_email(instance.username) else '', 
            phone = instance.username if test_phone(instance.username) else ''
        )
        form.save(commit = False)
        user.save()
        return HttpResponse(model_to_dict(user))
    else:
        return HttpResponse(CODE['4'])


#登录执行的函数，接收POST请求，返回字符串
@require_POST
def login_submit(request):
    body = bi2obj(request)
    user = auth.authenticate(request, username = body['username'], password = body['password'])
    if(user is not None):
        auth.login(request , user)
        return HttpResponse(CODE['0'])
    else:
        return HttpResponse(CODE['11'])

#check the username exists
@require_GET
def test_username(request):
    get_username = request.GET.get('username')
    try:
        User.objects.get(username=get_username)
        return HttpResponse(True)          
    except:
        return HttpResponse(False) 
