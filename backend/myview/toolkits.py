import json
import datetime
from django.db.models.fields.files import ImageFieldFile, FieldFile
from django.forms.models import model_to_dict

CODE = { # 0~10 Common Stuff    10~20 Login/Signup Stuff  20~30 Index Stuff  40~50  Live Room Stuff
    "0" : "Success",
    "1" : "Error, Unknown Reason",
    "2" : "HTTP Method Type Error , Change to Get",
    "3" : "HTTP Method Type Error , Change to Post",
    "4" : "Post Format Invalid, Not Consist With Form Format",
    "5" : "No Changes Detect",

    "10": "Email Is Invalid",
    "11": "User Never Exists",
    "12": "Permission Denied, Please Check The Login Status Or Session",
    "13": "Password Incorrect",
    "14": "Username has already in use",

    "20": "File Type Error",
    "21": "User is alerady in Living",
    "22": "Only teacher can start a Live Room",
    "23": "Room Never Exists",
    "24": "Room Is Not Living Anymore",
    "25": "Empty File",
}

def model_to_json(model):
    model_dict = model_to_dict(model)
    for k, v in model_dict.items():
        model_dict[k] = encode_json(model_dict[k]) if model_dict[k] is not None else None
    return model_dict

def encode_json(obj):
    try:
        return json.dumps(obj)
    except:
        if(isinstance(obj, datetime.date)):
            try:
                return obj.strftime('%Y-%-m-%d %H:%m:%S')
            except (ValueError, e):
                return ''
        if(isinstance(obj, ImageFieldFile)):
            try:
                return obj.path
            except (ValueError, e):
                return ''
        if(isinstance(obj, FieldFile)):
            try:
                return obj.path
            except (ValueError, e):
                return ''
        raise TypeError(repr(obj) + " ???")


def bi2obj(request):# in binary form
    #if(request.method == "POST"):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body


def Log(msg, title = "Default Title"):
    print(title +" : " + msg)