# fileUpload v0.0.1
## 一个用于ajax图片上传jquery插件
### 支持的浏览器版本：Firefox，UC，搜狗，360浏览器，Safari4+，Chrome，IOS版Safari和安卓版Webkit，IE9+
## 插件用法：
* 1、下载本插件（git clone git@github.com:hugzh/fileUpload.git）
* 2、使用插件之前必须先载入jquery库，然后在html页面载入本插件((fileupload/upload.js)，载入插件的CSS文件(fileupload/style.css)
* 3、选择需要绘制插件的元素对象，调用fileUpload插件，比如:  
```bash 
    $('#show').fileUpload('/upload',function(status,response){
     //doSomething
    });
```
    其中，插件第一个参数为后台处理函数的路径--"/upload",第二个参数为回调函数。回调函数的两个回调值分别是：是否上传成功的标志信息     status，以及来自服务器的回调文本或对象response。
* 4、插件当前版本正在完善ing

