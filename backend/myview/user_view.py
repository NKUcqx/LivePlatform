from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from django.views.decorators.http import require_POST, require_GET
from django.contrib import auth
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from random import Random
from django.core.mail import send_mail
from . import toolkits
from backend.models import User
from backend.forms import UserForm

import json
import re
import os
# Create your views here.

CODE = toolkits.CODE
bi2obj = toolkits.bi2obj
model_to_json = toolkits.model_to_json
change_prefix = toolkits.change_prefix
# 生成随机字段


def random_str(randomlength=4):
    string = ''
    chars = '1234567890'
    length = len(chars) - 1
    random = Random()
    for i in range(randomlength):
        string += chars[random.randint(0, length)]
    return string


# 检测邮箱是否有效


def test_email(email):
    if len(email) >= 5:
        if re.match("[a-zA-Z0-9]+\@+[a-zA-Z0-9]+\.+[a-zA-Z]",
                    email) is not None:
            return True
    return False


def test_phone(phone):
    model = re.compile('^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}')
    phonematch = model.match(phone)
    return True if phonematch else False


def create_user_folder(username):
    if (os.path.exists(os.path.join('frontend', 'static', 'users', username))):
        return False
    os.makedirs(os.path.join('frontend', 'static', 'users', username))
    return True


def get_session_key(request):
    if (not request.session.session_key):
        request.session.save()
    return request.session.session_key

def wrap_user(user):
    user = model_to_json(user)
    user['avatar'] = change_prefix(user['avatar'])
    return user

@require_GET
def getUser(request):
    user_id = request.GET.get('user_id', None)
    if (user_id):
        try:
            user = User.objects.get(pk=user_id)
            return JsonResponse({'user': wrap_user(user)})
        except BaseException:
            return HttpResponse(content=CODE['12'], status=401)
    else:
        # must have a user_id
        return HttpResponse(content=CODE['4'], status=400)


# 发送邮件


@require_POST
def sendTo(request):
    body = bi2obj(request)
    email = body['email']
    code = body['code']
    if (test_email(email)):
        try:
            message = u"您的注册码为" + str(code)
            send_mail(
                u'注册用户验证信息',
                message,
                '15302178925@163.com', [email],
                fail_silently=False)
            return HttpResponse(content=CODE['0'])
        except BaseException:
            # i don't know where or what error will this receipt
            return HttpResponse(content=CODE['1'], status=500)
    else:
        return HttpResponse(content=CODE['10'], status=400)


# 注册执行的函数，接收GET请求，返回字符串
@csrf_exempt
@require_POST
def signupSubmit(request):
    body = bi2obj(request)
    form = UserForm(body)
    if (form.is_valid()):
        instance = form.save(commit=False)
        if (create_user_folder(instance.username)):
            user = User.objects.create_user(
                username=instance.username,
                password=instance.password,
                gender=instance.gender,
                nickname=instance.nickname,
                email=instance.username
                if test_email(instance.username) else None,
                phone=instance.username
                if test_phone(instance.username) else None)
            form.save(commit=False)
            user.save()
            auth.login(request, user)
            session_key = get_session_key(request)
            return JsonResponse({
                'user': wrap_user(user),
                'session_key': session_key
            })
        else:
            return HttpResponse(content=CODE['1'], status=500)
    else:
        return HttpResponse(content=CODE['4'], status=400)


# 登录执行的函数，接收POST请求，返回字符串
@csrf_exempt
@require_POST
def loginSubmit(request):
    body = bi2obj(request)
    user = auth.authenticate(
        request, username=body['username'], password=body['password'])
    if (user is not None):
        auth.login(request, user)
        session_key = get_session_key(request)
        return JsonResponse({
            'user': wrap_user(user),
            'session_key': session_key
        })
    else:
        return HttpResponse(content=CODE['13'], status=401)

@csrf_exempt
@require_POST
def logoutSubmit(request):
    auth.logout(request)
    return HttpResponse(content=CODE['0'], status=200)

# check the username exists


@require_GET
def testUsername(request):
    get_username = request.GET.get('username')
    try:
        User.objects.get(username=get_username)
        return HttpResponse(content=CODE['0'])
    except BaseException:
        return HttpResponse(status=401)

@csrf_exempt
@require_POST
def changeAvatar(request):
    user = User.objects.get(pk=request.user.id)
    avatar = request.FILES.get('avatar', None)
    if (avatar is not None):
        user.avatar = avatar
        auth.login(request, user)
        user.save()
        return JsonResponse({'user': wrap_user(user)})
    else:
        return HttpResponse(content=CODE['25'], status=415)

@csrf_exempt
@require_POST
def changeGenderAndNickname(request):
    body = bi2obj(request)
    user = User.objects.get(pk=request.user.id)
    gender = body.get('gender', None)
    nickname = body.get('nickname', None)
    if (user.gender != gender and gender is not None):
        user.gender = gender
        user.save()
    if (user.nickname != nickname and nickname is not None and nickname != ''):
        user.nickname = nickname
        user.save()
    auth.login(request, user)
    return JsonResponse({'user': wrap_user(user)})

@csrf_exempt
@require_POST
def changePassword(request):
    body = bi2obj(request)
    forget_pw = body.get('forget_pw', None)
    username = body.get('username', None)
    password = body.get('password', None)
    new_password = body.get('new_password', None)
    res_pack = {}
    if (username is None or new_password is None):
        return HttpResponse(content=CODE['4'], status=401)
    if (forget_pw is None):
        # means he just wants to reset pw, which need verify his status
        user = auth.authenticate(username=username, password=password)
    else:  # means this poor guy has forget his pw, reset directly
        user = User.objects.get(username=username)
        res_pack['session_key'] = get_session_key(request)
    if (user is not None):
        user.set_password(new_password)
        user.save()
        auth.login(request, user)
        res_pack['user'] = wrap_user(user)
        return JsonResponse(res_pack)
    else:
        return HttpResponse(content=CODE['13'], status=401)

@require_GET
def getUserFromSession(request):
    session_key = request.GET.get('session_key', None)
    print(session_key)
    if (session_key):
        try:
            session = Session.objects.get(session_key=session_key)
            uid = session.get_decoded().get('_auth_user_id')
            user = User.objects.get(pk=uid)
            user_json = wrap_user(user)
            return JsonResponse({'user': user_json})
        except BaseException:
            return HttpResponse(content=CODE['12'], status=401)
    else:
        return HttpResponse(content=CODE['4'], status=400)
