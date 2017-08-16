import os

date = '20170816' 
room = '1000'
recordFileRootDir = '.'
os.system('python3.6 video_convert.py '+recordFileRootDir+'/'+date+'/'+room+'*')