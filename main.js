const electron = require('electron');
const url = require('url');
const $ = require("jquery");
// Module to control application life.
const app = electron.app;
//为了显示系统托盘添加的const
const path = require('path');
const ipc = electron.ipcMain;
const Menu = electron.Menu;
const Tray = electron.Tray;
let appIcon = null;

ipc.on('remove-tray', function () {
    console.log("退出程序");
    appIcon.destroy();
    // app.quit();
    app.exit();
});
ipc.on('flicker-tray1', function () {
    appIcon.setImage(path.join(__dirname,'home1.ico'));
});
ipc.on('flicker-tray2', function () {
    appIcon.setImage(path.join(__dirname,'home3.ico'));
});

app.on('window-all-closed', function () {
    if (appIcon) appIcon.destroy()
      mainWindow.hide();//隐藏住窗体
});

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    const iconName = process.platform === 'win32' ? 'home1.ico' : 'home2.ico'
    const iconPath = path.join(__dirname, iconName)
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Remove',
        click: function () {
            appIcon.destroy();
            // app.quit();
            app.exit();
        }
    }])
    appIcon.setToolTip('这是下班提醒的demo')
    appIcon.setContextMenu(contextMenu)
    appIcon.on('click', function(event){
      mainWindow.show();
    });
    //拿到屏幕的size
    var electronScreen = electron.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    // mainWindow = new BrowserWindow({ width: size.width, height: size.height });
    mainWindow = new BrowserWindow({
        width: 720,
        height: 492,
        // 不显示窗口
        //show: false
    })
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    // Open the DevTools.
    //开发模式
    // mainWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    })

    mainWindow.on('close', function (event) {
        // if (appIcon) appIcon.destroy()
        // mainWindow.hide();//隐藏住窗体
        event.preventDefault();
        mainWindow.hide();
    })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
        }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
