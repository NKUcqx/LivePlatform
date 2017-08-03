from django.test import TestCase
from backend.api.LiveRoomAPI import selectRoom

# Create your tests here.
class LiveRoomAPITestCase(TestCase):
    def setUp(self):
        pass
    def test_selectRoom(self):
        print("---------begin----------\t\n")
        print(selectRoom().values_list)
        print("---------end----------\t\n")
        print("---------begin----------\t\n")
        print(selectRoom(id = 1).values_list)
        print("---------end----------\t\n")
    
    def tearDown(self):
        pass