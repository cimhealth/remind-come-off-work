
const $ = require('jquery');
var spawn = require('child_process').spawn;
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var sillyDateTime = require('silly-datetime');
const ipc = require('electron').ipcRenderer;
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const url = require('url')
const path = require('path')

var findStartComputerLogService = {

    findlog: function(){
              var ping = spawn('systeminfo');
              var bufferHelper = new BufferHelper();
              ping.stdout.on('data', function(chunk){
                  bufferHelper.concat(chunk);
              });
              ping.stdout.on('end',function(){
                  var str = iconv.decode(bufferHelper.toBuffer(),'gbk');
                  var begin = str.indexOf("系统启动时间");
                  var end = str.indexOf("系统制造商");
                  var time=sillyDateTime.format(new Date(), 'YYYY/MM/DD');
                  var position = str.indexOf(time);
                  var finishStr = str.substr(position, end-position)
                  var timeFinishStr = finishStr.substr(finishStr.indexOf(",")+1,end-finishStr.indexOf(","));
                  timeFinishStr  = timeFinishStr.trim();
                  var timeFinishArray = timeFinishStr.split(":");
                  var hour = timeFinishArray[0]*1+9;
                  var minute = timeFinishArray[1];
                  var second = timeFinishArray[2];
                  var goHomeTime = "您的下班时间为："+hour+":"+minute+":"+second;
                  var nowTime=sillyDateTime.format(new Date(), 'HH:mm:ss');
                  var nowTimeArray = nowTime.split(":");
                  var nowhour = nowTimeArray[0]*1*60;
                  var nowminute = nowTimeArray[1];
                  var nowsecond = nowTimeArray[2];
                  //距离下班的时间，以秒为单位
                  var differenceSecond = ((hour*1*60+minute*1)*60+second*1)-((nowTimeArray[0]*1*60+nowTimeArray[1]*1)*60+nowTimeArray[2]*1);
                  // console.log(((hour*1*60+minute*1)*60+second*1));
                  // console.log(((nowTimeArray[0]*1*60+nowTimeArray[1]*1)*60+nowTimeArray[2]*1));
                  console.log("differenceSecond:"+differenceSecond);
                  var openComputerTime = (hour*1-9+":"+minute+":"+second);
                  var goHomeTime = (hour+":"+minute+":"+second);
                  console.log("openComputerTime::"+openComputerTime);
                  // <font size="" color="#ff6600">XXXX年XX月XX日</font>
                  $("#openComputerTime").html("<font  color='#ff6600'>"+openComputerTime+"</font>");
                  $("#goHomeTime").html("<font  color='#ff6600'>"+goHomeTime+"</font>");
                  setTimeout(function() {
                      let isFlicker = true;
                      let flickerTray = false
                      var i=0;
                      interval = setInterval(function() {
                          console.log("while  add:"+i);
                          if (flickerTray) {
                              flickerTray = false
                              console.log("flicker-tray1");
                              ipc.send('flicker-tray1')
                          } else {
                              flickerTray = true
                              console.log("flicker-tray2");
                              ipc.send('flicker-tray2')
                          }
                          i++;
                      }, 500);
                      //     clearInterval(interval);//setInterval
                      let mainWindow
                      var electronScreen = electron.screen;
                      var size = electronScreen.getPrimaryDisplay().workAreaSize;
                      const {BrowserWindow} = require('electron').remote
                      let win = new BrowserWindow({
                          width: 300,
                          height: 300,
                          x: size.width-300,
                          y: size.height-300,
                          frame: false
                      })
                      win.loadURL(url.format({
                          pathname: path.join(__dirname, 'test2.html'),
                          protocol: 'file:',
                          slashes: true
                      }))
                      // win.webContents.openDevTools();
                }, differenceSecond*1000);
                //距离下班时间的变量differenceSecond以秒为单位，用时需要乘以1000，differenceSecond*1000
                var nowDate=sillyDateTime.format(new Date(), 'YYYY年MM月DD日');
                console.log("nowDate::"+nowDate);
                $('#nowDate').html("<font  color='#ff6600'>"+nowDate+"</font>");
              });
    },

    exitdemo: function(messages){
      console.log(messages);
      ipc.send('remove-tray');
    }
}

module.exports = findStartComputerLogService;
