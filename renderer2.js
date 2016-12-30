
var $ = require("jquery");
var os = require("os");
const path = require('path')
var sillyDateTime = require('silly-datetime');
const electron = require('electron');
const ipc = require('electron').ipcRenderer;
var findStartComputerLogService = require('./service/findStartComputerLogService');

const insert = document.getElementById('insert');
insert.addEventListener('click', function (event) {
    var fs = require("fs") ;
    var txt = $('#wordinfo').val();
    var pathname = path.join(os.tmpdir(), 'worklog.txt')
    //写入文件
    var data;
    console.log("pathname:"+pathname);
    console.log("txt:"+txt);
    var nowDate=sillyDateTime.format(new Date(), 'YYYY年MM月DD日');
    var datatxt  = "\r\n"+ nowDate+"工作内容为："+txt;
    fs.exists(pathname, function( exists ){
        console.log( exists ) ;
        if(exists){
            fs.appendFile(pathname,datatxt,'utf8',function(err){
                console.log("File appendFile !"); //文件被保存
                if(err){
                    console.log(err);
                }
            });
        }else{
            fs.writeFile(pathname,datatxt,function (err) {
                if (err) throw err ;
                console.log("File Saved !"); //文件被保存
            });
        }
    });
    findStartComputerLogService.exitdemo("退出");
});
