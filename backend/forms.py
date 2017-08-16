from django import forms
from .models import Test,LiveRoom,User

class TestForm(forms.ModelForm):
    class Meta:
        model = Test
        fields = ('content',)

class LiveRoomForm(forms.ModelForm):
    class Meta:
        model = LiveRoom
        fields = ('name','creator')

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username','password', 'gender', 'nickname')