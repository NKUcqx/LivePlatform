# 安装cloudconvert pip install cloudconvert
import cloudconvert
import zipfile  
api = cloudconvert.Api('LRxCwzT2-CLqFqr936dWjknyulqsjFtXVL1GQLcmJhsgG_Ad7503sH98cGcSvFhQe5pRUWmuR4tb448MvgarEg')
 
process = api.convert({
    "inputformat": "ppt",
    "outputformat": "jpg",
    "input": "download",
    "file": "file///:e:/1.ppt" #转换文件的URL
})
process.wait()
process.download() #可以自定义文件夹，默认当前文件夹下，因为陈齐翔的日志我不知道是怎么写的，所以就先不命名了
# 解压缩
def un_zip(file_name):  #将自定义文件夹传进来就可以了
    zip_file = zipfile.ZipFile(file_name)  
    if os.path.isdir(file_name + "_files"):  
        pass  
    else:  
        os.mkdir(file_name + "_files")  
    for names in zip_file.namelist():  
        zip_file.extract(names,file_name + "_files/")  
    zip_file.close()  