# 安装cloudconvert pip install cloudconvert
import cloudconvert
api = cloudconvert.Api('LRxCwzT2-CLqFqr936dWjknyulqsjFtXVL1GQLcmJhsgG_Ad7503sH98cGcSvFhQe5pRUWmuR4tb448MvgarEg')
 
process = api.convert({
    "inputformat": "ppt",
    "outputformat": "jpg",
    "input": "download",
    "file": "file///:e:/1.ppt" #转换文件的URL
})
process.wait()
process.download() #可以自定义文件夹，默认当前文件夹下
# 解压缩
