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
    "25": "Empty File",
}

CODE = {    # 0~10 Common Stuff    10~20 Login/Signup Stuff  20~40 Index Stuff
    '0':{
        'code': '0',
        'message': 'Success',
    },
    '1':{
        'code': '1',
        'message': 'Error, Unknown Reason',
    },
    '2':{
        'code': '2',
        'message': 'HTTP Method Type Error , Change to Get',
    },
    '3':{
        'code': '3',
        'message': 'HTTP Method Type Error , Change to Post',
    },
    '4':{
        'code': '4',
        'message': 'Post Format Invalid, Not Consist With Form Format',
    },
    '10':{
        'code': '10',
        'message': 'Email Is Invalid',
    },
    '11':{
        'code': '11',
        'message': 'User Never Exists',
    },
    '12':{
        'code': '12',
        'message': 'Permission Denied, Please Check The Login Status Or Session',
    },

    '20':{
        'code': '20',
        'message': 'File Type Error',
    },
    '21':{
        'code': '21',
        'message': 'User is alerady in Living',
    },
    '22':{
        'code': '22',
        'message': 'Only teacher can start a Live Room',
    },
    '23':{
        'code': '23',
        'message': 'Room Never Exists',
    },
    '24':{
        'code': '24',
        'message': 'Room Is Not Living Anymore',
    },
    '25':{
        'code': '25',
        'message': 'Empty File',
    },

}



def bi2obj(request):# in binary form
    #if(request.method == "POST"):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body


def Log(msg, title = "Default Title"):

    print(title +" : " + msg)