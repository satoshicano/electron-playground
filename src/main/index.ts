import { app, BrowserWindow } from "electron";
import loadDevtool from "electron-load-devtool";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

const isDevelopment = process.env.NODE_ENV !== "production";

log.transports.file.level = "info";
log.info("App starting...");

// let win: Electron.BrowserWindow = null;
let win: any;

const sendStatusToWindow = (text: string) => {
  log.info(text);
  win.webContents.send("message", text);
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow();

  mainWindow.on("closed", () => {
    win = null;
  });

  // Set url for `mainWindow`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDevelopment
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html#v${app.getVersion()}`;

  if (isDevelopment) {
    loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
    loadDevtool(loadDevtool.REDUX_DEVTOOLS);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL(url);

  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow.focus();
    setImmediate(() => {
      mainWindow.focus();
    });
  });

  return mainWindow;
};

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", info => {
  log.info(info);
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", info => {
  log.info(info);
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", err => {
  log.error(err);
  sendStatusToWindow("Error in auto-updater.");
});

autoUpdater.on("download-progress", progressObj => {
  let logMessage = "Download speed: " + progressObj.bytesPerSecond;
  logMessage = logMessage + " - Downloaded " + progressObj.percent + "%";
  logMessage =
    logMessage + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  sendStatusToWindow(logMessage);
});

autoUpdater.on("update-downloaded", info => {
  log.info(info);
  sendStatusToWindow("Update downloaded; will install in 5 seconds");
});

autoUpdater.on("update-downloaded", info => {
  log.info(info);
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

// Quit application when all windows are closed
app.on("window-all-closed", () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (win === null) {
    win = createMainWindow();
  }
});

app.on("ready", () => {
  createMainWindow();
});

app.on("ready", () => {
  if (!isDevelopment) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
