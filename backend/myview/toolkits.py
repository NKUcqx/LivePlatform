import json


CODE = { # 0~10 Common Stuff    10~20 Login/Signup Stuff  20~30 Index Stuff
    "0" : "Success",
    "1" : "Error, Unknown Reason",
    "2" : "HTTP Method Type Error , Change to Get",
    "3" : "HTTP Method Type Error , Change to Post",
    "4" : "Post Format Invalid, Not Consist With Form Format",

    "10": "Email Is Invalid",
    "11": "User Never Exists",
    "12": "Permission Denied, Please Check The Login Status Or Session",

    "20": "File Type Error",
    "21": "User is alerady in Living",
    "22": "Only teacher can start a Live Room",
    "23": "Room Never Exists",
    "24": "Room Is Not Living Anymore",
}

def bi2obj(request):# in binary form
    #if(request.method == "POST"):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body


def Log(title, msg):
    print(title +" : " + msg)