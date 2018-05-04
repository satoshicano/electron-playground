import { app, BrowserWindow } from "electron";
import loadDevtool from "electron-load-devtool";
import log from "electron-log";

const isDev = require("electron-is-dev");

log.transports.file.level = "info";
log.info("App starting...");

// using official auto update module
if (!isDev) {
  require("update-electron-app")({
    repo: "satoshicano/electron-playground"
  });
}

// let win: Electron.BrowserWindow = null;
let win: any;

const createMainWindow = () => {
  const mainWindow = new BrowserWindow();

  mainWindow.on("closed", () => {
    win = null;
  });

  // Set url for `mainWindow`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDev
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html#v${app.getVersion()}`;

  if (isDev) {
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
