const { app, BrowserWindow, Menu, shell, MenuItem } = require("electron");
const unhandled = require("electron-unhandled");
const lib = require("./src/lib");
const logger = require("./src/lib/logger");
logger.info("****************************");
logger.info("*** Application starting ***");
logger.info("****************************");

unhandled({
  logger: error => {
    win.webContents.send("error", error.message);
    logger.error(error.message);
  }
});

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
    show: false,
    webPreferences: {
      nodeIntegration: true // https://electronjs.org/docs/tutorial/security#how
    }
  });
  win.loadFile("src/index.html");

  setupMenu();

  win.once("ready-to-show", () => {
    // Causes ready-to-show to not fire. https://github.com/electron/electron/issues/20352
    win.maximize();

    win.show();
    win.setProgressBar(2);
    lib.initialize(win).then(() => {
      win.setProgressBar(-1);
    });
  });

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
      role: "appMenu",
      submenu: [
        {
          label: "Reload Data",
          click() {
            win.setProgressBar(2);
            lib.resendPageData(win, true).then(() => {
              win.setProgressBar(-1);
            });
          }
        },
        {
          label: "Reload Page",
          click() {
            win.reload();
            win.webContents.once("dom-ready", () => {
              lib.resendPageData(win, false);
            });
          }
        },
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
          label: "Erai-raws website",
          click() {
            shell.openExternal("https://www.erai-raws.info/");
          }
        },
        {
          label: "HorribleSubs website",
          click() {
            shell.openExternal("https://horriblesubs.info/");
          }
        },
        { type: "separator" },
        {
          label: "About",
          click() {
            showAboutWindow();
          }
        }
      ]
    }
  ]);

  if (!app.isPackaged) {
    menu.append(
      new MenuItem({
        label: "Debug",
        submenu: [
          {
            label: "Open DevTools",
            accelerator: "CmdOrCtrl+Shift+I",
            role: "toggleDevTools"
          },
          {
            label: "Reload page",
            accelerator: "CmdOrCtrl+Shift+R",
            click() {
              win.reload();
              win.webContents.once("dom-ready", () => {
                lib.resendPageData(win, false);
              });
            }
          }
        ]
      })
    );
  }

  Menu.setApplicationMenu(menu);
}

function showAboutWindow() {
  const aboutWin = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    parent: win,
    modal: true,
    backgroundColor: "#252a30",
    webPreferences: {
      nodeIntegration: true // https://electronjs.org/docs/tutorial/security#how
    }
  });
  aboutWin.loadFile("src/about.html");

  aboutWin.webContents.once("dom-ready", () => {
    lib.sendAboutData(aboutWin);
  });
}
