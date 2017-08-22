from django.test import TestCase, Client
from backend.myview import room_view, user_view, toolkits
from backend.models import LiveRoom, User
from django.utils import timezone
from django.forms.models import model_to_dict
from backend.models import User,LiveRoom
from backend.myview.user_view import random_str
from backend.myview.user_view import test_phone
from backend.myview.user_view import test_email
from backend.myview.user_view import create_user_folder
from backend.myview.user_view import getUser
from backend.myview.user_view import sendTo
from backend.myview.user_view import signupSubmit
from backend.myview.user_view import loginSubmit
from backend.myview.user_view import testUsername
from backend.myview.user_view import changeAvatar
from backend.myview.user_view import changeGenderAndNickname
from backend.myview.user_view import changePassword
from backend.myview.user_view import getUserFromSession
'''from backend.myview.punishment_base import banSpeakOne
from backend.myview.punishment_base import banSpeakPublic
from backend.myview.punishment_base import outOne
from backend.myview.punishment_base import clean_table
from backend.myview.punishment_base import is_out
from backend.myview.punishment_base import is_ban_speak'''
from django.contrib import auth
import os
import re
import json

# Create your tests here.


class UserTestCase(TestCase):
    def setUp(self):
        self.c = Client()
        self.user1 = User.objects.create_user(
            username='HIHA', password='1234', phone='15302178925')
        self.user2 = User.objects.create_user(
            username='baobao', password='1234', phone='15222856278')
        self.user3 = User.objects.create_user(
            username='xiaolaotou', password='1234', phone='13752652469')
        self.user4 = User.objects.create_user(
            username='chenqixiang', password='1234', email='892670992@qq.com')

    def test_create_user(self):
        #self.assertEqual(self.user1.avatar.name, 'frontend/static/users/default_avatar/avatar.jpg')
        self.assertEqual(self.user1.role, 'S')
        self.assertEqual(self.user1.phone, '15302178925')
        self.assertEqual(self.user1.gender, True)
        self.assertEqual(self.user4.phone, None)
        self.assertEqual(self.user1.email, '')

    def test_random_str(self):
        self.assertEqual(len(random_str()), 4)
        self.assertEqual(len(random_str(5)), 5)
        self.assertTrue(random_str().isdigit())

    def test_test_email(self):
        self.assertTrue(test_email('15302178925@163.com'))
        self.assertTrue(test_email('2020263746@qq.com'))
        self.assertTrue(test_email('dongbaobao94@gmail.com'))

    def test_test_phone(self):
        self.assertTrue(test_phone('15302178925'))
        self.assertTrue(test_phone('15222856278'))
        self.assertTrue(test_phone('13752652469'))
        self.assertTrue(test_phone('13662197063'))

    def test_sendTo(self):
        user_dic = {"email": "15302178925@163.com", "code": "4345"}
        user_json = json.dumps(user_dic)
        response = self.c.post(
            '/sendemail/', user_json, content_type="application/json")
        self.assertEqual(response.status_code, 200)

    def test_signupSubmit(self):
        user_dic = {
            "username": "15032002730",
            "phone": "15032002730",
            "password": "cqx1997215"
        }
        user_json = json.dumps(user_dic)
        response = self.c.post(
            '/signup/', user_json, content_type="application/json")
        self.assertEqual(response.status_code, 400)
'''class PunishmentTestCase(TestCase):
    def setUp(self):
        self.user1=User.objects.create_user(username='HIHA',password='1234',phone='15302178925')
        self.user2=User.objects.create_user(username='baobao',password='1234',phone='15222856278')
        self.user3=User.objects.create_user(username='xiaolaotou',password='1234',phone='13752652469')
        self.user4=User.objects.create_user(username='chenqixiang',password='1234',email='892670992@qq.com')
        self.room1=LiveRoom(name='toutouroom',creater=self.user3)
        self.room1.save()
        self.room2=LiveRoom(name='baobaoroom',creater=self.user2)
        self.room2.save()
    def test_banSpeakOne(self):
        banSpeakOne(self.room1,self.user1)
        banSpeakOne(self.room1,self.user2)
        punishment1=Punishment.objects.filter(room=self.room1,user=self.user1,punishment='S')
        punishment2=Punishment.objects.filter(room=self.room1,user=self.user2,punishment='S')
        self.assertEqual(len(punishment1),1)
        self.assertEqual(len(punishment2),1)
    def test_banSpeakPublic(self):
        banSpeakPublic(self.room1,[self.user1,self.user2])
        punishment1=Punishment.objects.filter(room=self.room1,punishment='S')
        self.assertEqual(len(punishment1),2)
    def test_outOne(self):
        outOne(self.room2,self.user1)
        outOne(self.room2,self.user2)
        self.assertEqual(len(Punishment.objects.filter(room=self.room2,user=self.user1,punishment='K')),1)
        self.assertEqual(len(Punishment.objects.filter(room=self.room2,user=self.user2,punishment='K')),1)
    def test_clean_table(self):
        banSpeakOne(self.room1,self.user1)
        banSpeakOne(self.room2,self.user1)
        outOne(self.room2,self.user1)
        outOne(self.room2,self.user2)
        clean_table(self.room1)
        self.assertEqual(len(Punishment.objects.filter(room=self.room1)),0)
    def test_is_ban_speak(self):
        banSpeakOne(self.room1,self.user1)
        banSpeakOne(self.room1,self.user2)
        self.assertTrue(is_ban_speak(self.room1,self.user1))
        self.assertEqual(is_ban_speak(self.room1,self.user3),False)
    def test_is_out(self):
        outOne(self.room1,self.user1)
        outOne(self.room1,self.user2)
        self.assertTrue(is_out(self.room1,self.user1))
        self.assertEqual(is_out(self.room1,self.user3),False) '''
class RoomViewTestCase(TestCase):
    def setUp(self):
        self.c = Client()
        user_dic = {
            "username": "15032002730",
            "phone": "15032002730",
            "password": "cqx1997215"
        }
        user_json = json.dumps(user_dic)
        self.c.post('/signup/', user_json, content_type="application/json")
        user = User.objects.create_user(
            username="15032002730",
            phone="15032002730",
            password="cqx1997215",
            role="T")
        user.save()
        user_json = json.dumps({
            "username": "15032002730",
            "password": "cqx1997215"
        })
        self.c.post('/login/', user_json, content_type="application/json")
        pass

    def test_create_folder(self):
        room_view.create_folder("unittest")
        self.assertTrue(os.path.exists("unittest"))
        self.assertTrue(os.path.isdir("unittest"))
        self.assertTrue(os.path.isfile("unittest/log.txt"))

    def test_create_get_end_room(self):
        room = {"name": "test_room1"}
        res = self.c.post('/createroom/', room)
        self.assertEqual(res.status_code, 200)
        res = self.c.post('/endroom/', {})
        self.assertTrue(res.status_code, 200)

        room = {"name": "test_room2", "is_silence": "true"}
        res = self.c.post('/createroom/', room)
        self.assertEqual(res.status_code, 200)
        res = self.c.post('/endroom/', {})
        self.assertEqual(res.status_code, 200)

        # test the trigger
        room = {"name": "test_room3"}
        res = self.c.post('/createroom/', room)
        room = LiveRoom.objects.get(name="test_room3")
        self.assertTrue(room.end_time is None)

        req = {'audience_amount': '999'}
        req = json.dumps(req)
        res = self.c.post('/updateroom/', req, content_type="application/json")
        room = LiveRoom.objects.get(name='test_room3')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(room.audience_amount, 999)

        req = {'name': 'new_room_name'}
        req = json.dumps(req)
        res = self.c.post('/updateroom/', req, content_type="application/json")
        rooms = LiveRoom.objects.filter(name='new_room_name')
        self.assertTrue(len(rooms) > 0)
        self.assertEqual(rooms[0].name, 'new_room_name')

        req = {}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(content['rooms']), 3)
        req = {"id": "1"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)
        req = {"order_by": "name"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 3)
        req = {"is_living": "true"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)
        req = {"is_living": "false"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit": "2"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit": "3", "start": "1"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 2)
        req = {"limit": "3", "start": "2"}
        res = self.c.get('/getroom/', req)
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(len(content['rooms']), 1)

        res = self.c.get('/getroomamount/', {})
        content = json.loads(res.content.decode('utf8'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(content['living_amount'], 1)
        self.assertEqual(content['end_amount'], 2)
        
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
        self.assertTrue(result)

    def test_change_prefix(self):
        self.assertEqual(toolkits.change_prefix('1/2/3'), '1/2/3')
        self.assertEqual(toolkits.change_prefix('1/2/static/3', False), '/static/3')
        self.assertEqual(toolkits.change_prefix('1/2/3', True, '0'), '/0/1/2/3')
        self.assertEqual(toolkits.change_prefix('1/2/3', False, '2'), '/2/3')
    def test_get_file_amount(self):
        self.assertEqual(toolkits.get_file_amount('backend/record', False), (5,1))
        self.assertEqual(toolkits.get_file_amount('backend/record', True), (6,1))
        self.assertEqual(toolkits.get_file_amount('backend/record'), (6,1))
    '''def test_bi2obj(self):
        json_data = json.dumps({'bool': True, 'integer': 1, 'NoneType': None, 'Null': 'null', 'undefiend': 'undefiend'})
        request = json.dumps({body:json_data})
        pass'''
    def tearDown(self):
        pass