const { shell, ipcMain, app } = require("electron");
const logger = require("./utils/logger");
const datastore = require("./db/datastore");
const sources = require("./sources");

let data = [];

async function initialize(win) {
  datastore.intialize();
  data = await sources.collectData();
  logger.info("Sending data to render process");
  win.webContents.send("feed-data", data);
}

async function resendPageData(win, refreshData) {
  if (refreshData) {
    data = await sources.collectData();
  }
  logger.info("Sending data to render process");
  win.webContents.send("feed-data", data);
}

async function sendAboutData(win) {
  win.webContents.send("about-data", { appVersion: app.getVersion() });
}

ipcMain.on("download", async (event, arg) => {
  logger.info(`Received download request for ${arg.title}`);
  if (arg.source == "HorribleSubs") {
    shell.openExternal(arg.link);
  } else {
    const magnet = await sources.getEraiTorrentMagnet(arg);
    shell.openExternal(magnet);
  }
});

ipcMain.on("open-anime", (event, arg) => {
  shell.openExternal(arg.siteUrl);
});

module.exports = {
  initialize,
  resendPageData,
  sendAboutData,
};
