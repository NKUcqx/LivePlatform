from backend.models import User
from django.http import HttpResponse
from backend.forms import UserForm
from . import toolkits
from . import user_view
CODE = toolkits.CODE
test_email = user_view.test_email
test_phone = user_view.test_phone
# 更改密码


def change_password(request):
    body = bi2obj(request)
    username = body['username']
    new_password = body['password']
    user = User.objects.get(username=username)
    user.set_password(new_password)
    user.save()
# 返回此人的基本信息包括头像，昵称，手机号，邮箱


def private_message(user):
    result = {}
    result['nickname'] = user.nickname
    result['phone'] = user.phone if '@' not in user.phone else ''
    result['email'] = user.email if '@' in user.email else ''
    result['gender'] = user.gender
    result['role'] = user.role
    result['avatar'] = user.avatar
    return result
# 检查手机号和邮箱的重复


def find_repeat(coonect):
    if test_email(connect):
        repeat = User.objects.get(email=connect)
    elif test_phone(connect):
        repeat = user.objects.get(phobe=connect)
    else:
        return True
    if len(repeat) > 0:
        return True
    else:
        return False
# 换手机号，邮箱之前保证换后的手机号是可以联系到的


def ensure_connect(user, connect):
    if test_email(connect):
        send_to(connect)
        return HttpResponse('已发送邮件，注意查收')
    elif test_phone(connect):
        return HttpResponse('已发送短信，注意查收')
    else:
        return HttpResponse('手机号或者邮箱不存在，注意查收')
# 更换邮箱，手机,密码


def change_connect(user, connect):
    if test_email(connect):
        user.email = connect
        user.save()
        return HttpResponse(CODE['0'])
    elif test_phone(connect):
        user.phone = connect
        user.save()
        return HttpResponse(CODE['0'])
    else:
        user.set_password(connect)
        return HttpResponse(CODE['0'])


def find_user(user_id=0, username='', email='', phone=''):
    if user_id != 0:
        result = User.objects.get(id=user_id)
    elif username.strip() != '':
        result = User.objects.get(username=username)
    elif email.strip() != '':
        result = User.objects.get(email=email)
    elif phone.strip() != 0:
        result = User.objects.get(phone=phone)
    return result
# 更改头像，未测试


def change_avatar(user, new_avatar):
    user.update(avatar=new_avatar)
# 检查密码是否符合要求，长度超过八位，不能全是数字或者字母


def check_password_legal(password):
    if len(password) < 8:
        return False
    elif password.isdigit():
        return False
    elif password.isalpha():
        return False
    else:
        return True


def find_repeat(connect):
    if test_email(connect):
        repeat = User.objects.filter(email=connect)
    else:
        repeat = User.objects.filter(phobe=connect)
    if len(repeat) > 0:
        return True
    else:
        return False
