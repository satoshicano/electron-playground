'use strict';

const{ app, BrowserWindow } = require('electron');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info"
log.info('App starting...');

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

autoUpdater.on('update-downloaded', (info) => {
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000)
})

app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});
