import os

room = '1000'
recordFileRootDir = '.'
os.system('./Recorder_local --appId "0c6a0a8f844c49d78a9aac0907dfc1d8" --uid 0 --channel '+room+' --appliteDir "./bin/" --channelProfile 1 --recordFileRootDir '+recordFileRootDir)