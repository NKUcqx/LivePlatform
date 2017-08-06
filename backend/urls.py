from django.conf.urls import url
from . import views
from django.views.generic import TemplateView
from .myview import room_view, user_view

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name = "index.html")),
    url(r'^signup/$', user_view.signup_submit, name = 'signup'),
    url(r'^login/$', user_view.login_submit, name = 'login'),
    url(r'^sendemail/$', user_view.send_to, name = 'sendemail'),
    url(r'^testusername/$', user_view.test_username, name = 'testusername'),
   # url(r'^findre/$', user_view.query_repeat_username, name = 'findre'),
   # url(r'^websocket/$', user_view.websocket, name = 'websocket'),
    url(r'^createroom/$', room_view.createRoom, name = 'create_room' ),
    url(r'^endroom/$', room_view.endRoom, name = 'end_room' ),
    url(r'^createroom/$', room_view.createRoom , name = 'create_room' ),
    url(r'^getroom/$', room_view.getRooms , name = 'get_room' ),
    url(r'^avatar/$', user_view.change_avatar, name = 'change_avatar')
]
