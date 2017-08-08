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
            return HttpResponse(content = CODE['0'])
        except:
            return HttpResponse(content = CODE['1'],status = 500)# i don't know where or what error will this receipt
    else:
        return HttpResponse(content = CODE['10'], status = 400)

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
        return HttpResponse(content = CODE['4'], status = 400)


#登录执行的函数，接收POST请求，返回字符串
@require_POST
def login_submit(request):
    body = bi2obj(request)
    user = auth.authenticate(request, username = body['username'], password = body['password'])
    if(user is not None):
        auth.login(request , user)
        return HttpResponse(content = CODE['0'])
    else:
        return HttpResponse(content = CODE['13'], status = 401)

#check the username exists
@require_GET
def test_username(request):
    get_username = request.GET.get('username')
    try:
        User.objects.get(username = get_username)
        return HttpResponse(content = CODE['0'])          
    except:
        return HttpResponse(status = 401)
<<<<<<< HEAD


@require_POST
def change_avatar(request):
    user = User.object.get(id = request.user_id)
    avatar = request.FILES.get('avatar', None)
    if(avatar is not None):
        user.avatar_path = avatar
        user.save()
        return HttpResponse(content = CODE['0'])
    else:
        return HttpResponse(content = CODE['25'], status = 415)

@require_POST
def change_personal_info(request):
    body = bi2obj(request)
    user = User.object.get(id = request.user_id)
    nickname = body.get('nickname', None)
    if(user.nickname != nickname and nickname != None and nickname != ''):
        user.nickname = nickname
        uesr.save()
        return HttpResponse(CODE['0'])
    else:
        return HttpResponse(CODE['5'], status = 401)

@require_POST
def change_password(request):
    body = bi2obj(request)
    forget_pw = body.get('forget_pw', None)
    username = body.get('username', None)
    password = body.get('password', None)
    new_password = body.get('new_password', None)
    if(username is None or new_password is None):
        return HttpResponse(CODE['4'], status = 401)

    if(forget_pw is None):#means he just wants to reset pw, which need verify his status
        user = auth.authenticate(username = username, password = password)
    else:#means this poor guy has forget his pw, reset directly
        user = User.objects.get(username = username)
    if(user is not None):
        user.set_password(new_password)
        user.save()
        return HttpResponse(CODE['0'])
    else:
        return HttpResponse(content = CODE['13'], status = 401)
