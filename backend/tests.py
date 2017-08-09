from django.test import TestCase,Client
from backend.myview import room_view,user_view,toolkits
from backend.models import LiveRoom,User
from django.utils import timezone
import os
import json

# Create your tests here.
class RoomViewTestCase(TestCase):
    def setUp(self):
        self.c = Client()
        user_dic = {"username":"15032002730","phone":"15032002730", "password":"cqx1997215"}
        user_json = json.dumps(user_dic)
        self.c.post('/signup/',user_json, content_type = "application/json")
        user = User.objects.create_user(
            username = "15032002730",
            phone = "15032002730",
            password = "cqx1997215",
            role = "T"
            )
        user.save()
        user_json = json.dumps({"username":"15032002730","password":"cqx1997215"})
        self.c.post('/login/',user_json,content_type = "application/json")
        pass
    def test_create_folder(self):
        room_view.create_folder("unittest")
        self.assertTrue(os.path.exists("frontend/static/rooms/unittest"))
        self.assertTrue(os.path.isdir("frontend/static/rooms/unittest"))
        self.assertTrue(os.path.isfile("frontend/static/rooms/unittest/chatlog.txt"))
    def test_create_get_end_room(self):
        room = {"name" : "test_room1"}
        res = self.c.post('/createroom/',room)
        self.assertEqual(res.status_code, 200)
        res = self.c.post('/endroom/',{})
        self.assertTrue(res.status_code, 200)

        room = {"name" : "test_room2", "is_silence" : "true"}
        res = self.c.post('/createroom/',room)
        self.assertEqual(res.status_code, 200)
        res = self.c.post('/endroom/',{})
        self.assertEqual(res.status_code, 200)

        #test the trigger
        room = {"name" : "test_room3"}
        res = self.c.post('/createroom/', room)
        room = LiveRoom.objects.get(name = "test_room3")
        self.assertFalse(room.is_silence)
        self.assertTrue(room.end_time is None)

        req = {}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(content['rooms']), 3)
        req = {"id" : "1"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)
        req = {"order_by":"name"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 3)
        req = {"is_living" : "true"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)
        req = {"is_living" : "false"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit" : "2"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit" : "3","start": "1"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit" : "3","start": "2"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)
    def tearDown(self):
        pass

class ToolkitsTestCase(TestCase):
    def setUp(self):
        pass
    def test_encode_json(self):
        result = toolkits.encode_json("json")
        self.assertEqual(type(result), type("string"))
        result = toolkits.encode_json(timezone.now())
        self.assertEqual(type(result), type("string"))
        result = toolkits.encode_json(123)
        self.assertEqual(result, "123")
        self.assertEqual(type(result), type("10"))
        result = toolkits.encode_json(True)
        self.assertEqual(result, "true")

    def tearDown(self):
        pass