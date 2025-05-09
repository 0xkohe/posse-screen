"use strict";
var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;
const path = require("path");

app.on("ready", function () {
  var firstWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  firstWindow.loadURL("file://" + __dirname + "/dialog/index.html");
  ipcMain.on("roomId", (event, roomId) => {
    firstWindow.close();
    firstWindow = null;

    let displays = electron.screen.getAllDisplays();

    for (const d of displays) {
      showWindow(
        roomId,
        d.bounds.x,
        d.bounds.y,
        d.bounds.width,
        d.bounds.height,
        d.workAreaSize.height
      );
    }
  });
});

function showWindow(roomId, x, y, width, height, workAreaHeight) {
  var mainWindow = new BrowserWindow({
    x: x,
    y: y,
    width: width,
    height: height,
    frame: false,
    show: true,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.maximize();
  mainWindow.loadURL(
    "file://" +
      __dirname +
      "/index.html?width=" +
      width +
      "&height=" +
      height +
      "&workAreaHeight=" +
      workAreaHeight +
      "&roomId=" +
      roomId
  );
  console.log("after loadURL");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
