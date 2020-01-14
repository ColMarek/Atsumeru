const { app, BrowserWindow, Menu, shell } = require("electron");
const lib = require("./src/lib");
const logger = require("./src/lib/logger");
logger.info("****************************");
logger.info("*** Application starting ***");
logger.info("****************************");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  logger.info(`Application ready. Running on ${process.platform}`);
  const frame = process.platform == "darwin" ? true : false;
  const icon = process.platform == "darwin" ? "assets/img/icon.icns" : "assets/img/icon.ico";
  win = new BrowserWindow({
    icon,
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    frame,
    backgroundColor: "#252a30",
    webPreferences: {
      nodeIntegration: true // https://electronjs.org/docs/tutorial/security#how
    }
  });
  win.maximize();
  win.loadFile("src/index.html");

  setupMenu();

  lib.initialize(win);

  // Emitted when the window is closed.
  win.on("closed", () => {
    logger.info("Window closed");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  logger.info("All windows closed");
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // DON'T DO THAT. QUIT WHEN ALL WINDOWS ARE CLOSED.
  app.quit();
});

app.on("activate", () => {
  logger.info("App activated");
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

function setupMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        { type: "separator" },
        {
          label: "Exit",
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Erai-raws",
          click() {
            shell.openExternal("https://www.erai-raws.info/");
          }
        },
        {
          label: "HorribleSubs",
          click() {
            shell.openExternal("https://horriblesubs.info/");
          }
        },
        { type: "separator" },
        {
          label: "Reload page",
          accelerator: "CmdOrCtrl+Shift+R",
          visible: !app.isPackaged, // Show page reload when in development
          click() {
            win.reload();
            win.webContents.once("dom-ready", () => {
              lib.resendPageData(win, false);
            });
          }
        },
        {
          label: "Open DevTools",
          accelerator: "CmdOrCtrl+Shift+I",
          visible: !app.isPackaged, // Show page reload when in development
          click() {
            win.webContents.openDevTools();
          }
        },
        {
          label: "About",
          click() {}
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}
