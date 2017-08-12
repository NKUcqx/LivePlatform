from django.conf.urls import url
from . import views
from django.views.generic import TemplateView
from .myview import room_view, user_view

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name = "index.html")),
    url(r'^signup/$', user_view.signupSubmit, name = 'signup'),
    url(r'^login/$', user_view.loginSubmit, name = 'login'),
    url(r'^logout/$', user_view.logoutSubmit, name = 'logout'),
    url(r'^sendemail/$', user_view.sendTo, name = 'sendemail'),
    url(r'^testusername/$', user_view.testUsername, name = 'test_username'),
    url(r'^changepass/$', user_view.changePassword, name = 'change_password'),
    url(r'^getsession/$', user_view.getUserFromSession, name = 'get_session'),
    url(r'^changeavatar/$', user_view.changeAvatar, name = 'change_avatar'),
    url(r'^changeinfo/$', user_view.changeGenderAndNickname, name = 'change_info'),
   # url(r'^findre/$', user_view.query_repeat_username, name = 'findre'),
    url(r'^websocket/$', views.websocket, name = 'websocket'),
    url(r'^codechannel/$', views.websocket, name = 'websocket'),
    url(r'^canvaschannel/$', views.websocket, name = 'websocket'),
    url(r'^endroom/$', room_view.endRoom, name = 'end_room' ),
    url(r'^createroom/$', room_view.createRoom , name = 'create_room' ),
    url(r'^getroom/$', room_view.getRooms , name = 'get_room' ),
]