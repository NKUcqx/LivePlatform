from django.utils import timezone
import json


CODE = { # 0~10 Common Stuff    10~20 Login/Signup Stuff
    "0" : "Success",
    "1" : "Error, Unknown Reason",
    "2" : "HTTP Method Type Error , Change to Get",
    "3" : "HTTP Method Type Error , Change to Post",
    "4" : "Post Format Invalid, Not Consist With Form Format",
    "5" : "Permission Denied, Please Check The Login Status Or Session",
    "6" : "Room Never Exists",
    "7" : "Room Is Not Living Anymore",

    "10": "Email Is Invalid",
    "11": "User Never Exists",
}

def bi2obj(request):# in binary form
    #if(request.method == "POST"):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body


def Log(title, msg):
    print(timezone.now + title +" : " + msg)