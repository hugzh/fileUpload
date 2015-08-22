/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2015-08-19
 * Time: 16:22:59
 * Contact: song.chen@qunar.com
 */
/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2015-08-16
 * Time: 09:37:09
 * Contact: song.chen@qunar.com
 */
// 基于FormData的文件上传插件
// 支持的浏览器版本：Firefox,UC，搜狗,360浏览器,Safari4+,Chrome,IOS版Safari和安卓版Webkit,IE9+
// 作者：Juice Who
(function($){
  $.fn.extend({          
    fileUpload:function(url,callback) {           
      var globalFile;
      var canvas = drawCanvas();
      $(this).append(canvas);

      //result 为拖拽事件的回调对象，也就是拖拽的文件 
      drag(function(result){
        globalFile = result;
      });
      
      $('#fileId').change(function(){
          if(this.files[0].name){
              $('#previewArea').html('<span>'+this.files[0].name+'<br>'+(this.files[0].size?(this.files[0].size/1024|0)+'KB':'')+'</span>');
          }
      });
      $('#fileupload_submitBtn').click(function (){
        var oo = new fileUploadObj('#fileId','/upload',globalFile);
        oo.send(function(responseText){
          $('#fileId').val('');
          globalFile = undefined;
          $('#previewArea').html('');
          // 上传完成之后执行回调
          callback.call(this,responseText.status,responseText.data);
        });
      }); 
     }  
  }); 
  function createXHR() {
      if(typeof XMLHttpRequest != "undefined") {
          return new XMLHttpRequest();
      } else if (typeof ActiveXObject != "undefined"){
          if (typeof arguments.callee.activeXString != "string") {
              var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
                  i,len;
              for (i = 0, len = versions.length; i<len;i++) {
                  try {
                      new ActiveXObject(versions[i]);
                      arguments.callee.activeXString = versions[i];
                      break;
                  }catch(e){}
              }
          }
          return new ActiveXObject(arguments.callee.activeXString);
      }
      else {
          throw new Error("NO XHR object available");
      }
  }

      // 处理拖拽后预览
  function progressFile(file) {
    var acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    };
    if (FileReader && acceptedTypes[file.type]) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var event = event||window.event;
        var image = new Image();
        image.src = event.target.result;
        image.width = 200; 
        document.getElementById('previewArea').appendChild(image);
      };

      reader.readAsDataURL(file);
    }  else {
      document.getElementById('dragArea').innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
    }
  }

  // 绘制html元素
  function drawCanvas(){
      // 创建canvas绘制UI
      var canvas = document.createElement('div'); 
      var tempElement = document.createElement('div');
      tempElement.setAttribute('id','dragArea');

      var fileBtn = document.createElement('input');
      fileBtn.setAttribute('type','file');
      fileBtn.setAttribute('name','file');
      fileBtn.setAttribute('id','fileId');

      var submitBtn = document.createElement('button');
      submitBtn.setAttribute('id','fileupload_submitBtn');
      submitBtn.innerHTML = 'submit';

      tempElement.appendChild(fileBtn);
      canvas.appendChild(submitBtn);
      canvas.appendChild(tempElement);

      // 定义预览区域
      
      var prevArea = document.createElement('div');
      prevArea.setAttribute('id','previewArea');
      canvas.appendChild(prevArea);
      
      return canvas;
  }

  // 拖拽功能
  function drag(callback) {
    　// 检查浏览器是否支持拖放上传。
      var globalFile;
  　　if('draggable' in document.createElement('span')){
  　　　　var dragArea = document.getElementById('dragArea');
  　　　　dragArea.ondragover = function (event) {
            var event = event||window.event;
            event.preventDefault();
            document.getElementById('previewArea').innerHTML = '';
            dragArea.style.borderColor="#90FF90";
            return false;
          };
          dragArea.ondragleave = function(event) {
            dragArea.style.borderColor="#ccc";
            return false; 
          };
  　　　　dragArea.ondragend = function (event) {
            dragArea.style.borderColor="#ccc";
            return false; 
          };
  　　　　dragArea.ondrop = function (event,globalFile) {
              var event = event||window.event;
  　　　　　　event.stopPropagation();
              event.preventDefault();
              dragArea.style.borderColor="#ccc";
              progressFile(event.dataTransfer.files[0]); 
              globalFile = event.dataTransfer.files[0];
              callback(globalFile)
  　　　　};
  　　} 
  }


  // 定义用于文件上传的对象
  function fileUploadObj(fileSelector,url,dragFile) {
    var obj = document.querySelector?document.querySelector(fileSelector):null;

    if (obj && window.FormData){
        this.obj = dragFile?dragFile:obj.files[0];
        this.formData = new FormData();
        this.url = url;
        this.xhr = createXHR();
    }
    else {
        alert('no form add')
    }
  }

  fileUploadObj.prototype = {
      constructor:fileUploadObj,
      setData: function (){
          this.formData.append('file',this.obj);
      },
      send: function (callback){  
          // 上传完成之后的回调函数
          this.xhr.onload = function(event) {
              // 上传成功]
              var callbackData = {};
              if (this.status >= 200 && this.status <300 || this.status === 304) {
                  // 上传成功之后回调函数，返回服务器数据
                 callbackData.data = this.responseText;
                 callbackData.status = true;
                 callback(callbackData);
              }
              // 失败
              else {
                  alert('上传失败'+this.responseText);
                  callbackData.data = this.responseText;
                  callbackData.status = false;
                  callback(callbackData);
              }
          };

          if (this.obj) {
            this.setData();
            this.xhr.open('POST',this.url);
            this.xhr.send(this.formData);
          }
          else {
            alert('未选中文件');
          }
          
      }
  }
})(jQuery);
