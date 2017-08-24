import json
import os
import datetime
from django.db.models.fields.files import ImageFieldFile, FieldFile
from django.forms.models import model_to_dict

CODE = { # 0~10 Common Stuff    10~20 Login/Signup Stuff  20~30 Index Stuff  40~50  Live Room Stuff
    "0" : "Success",
    "1" : "Error, Unknown Reason",
    "2" : "HTTP Method Type Error , Change to Get",
    "3" : "HTTP Method Type Error , Change to Post",
    "4" : "Format Invalid",
    "5" : "No Changes Detect",
    "6" : "Folder has already been created",
    "7" : "Index out of range",

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
        return obj if isinstance(obj, str) or isinstance(obj, bool) else json.dumps(obj)
    except:
        try:
            if(isinstance(obj, datetime.date)):
                return obj.strftime('%Y-%-m-%d %H:%m:%S')
            if(isinstance(obj, ImageFieldFile)):
                return obj.path
            if(isinstance(obj, FieldFile)):
                return obj.path
        except:
            return ''
        return ''

def bi2obj(request):# in binary form
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body

def Log(msg, title = "Default Title"):
    print(title +" : " + msg)

def change_prefix(long_path, add=False, target='static'):
    if (add):
        return '/' + os.path.join(target, long_path)
    try:
        path_arr = long_path.split('/')
        path = '/' + '/'.join(path_arr[path_arr.index(target):])
    except:
        return long_path
    return path

def get_file_amount(path, recursive = True):
    file_amount, folder_amount = 0, 0
    for rt, dirs, files in os.walk(path):
        file_amount += len(files)
        folder_amount += len(dirs)
        if(not recursive):
            break
    return file_amount, folder_amount