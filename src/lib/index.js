const { shell, ipcMain } = require("electron");
const erai = require("./erai-data");
const hs = require("./horrible-subs-data");
const logger = require("./logger");

let data = [];

async function initialize(win) {
  try {
    await collectData();
    console.dir(data.splice(0, 6));
    logger.info("Sending data to render process");
    win.webContents.send("feed-data", data);
  } catch (e) {
    logger.error(e.message);
  }
}

async function collectData() {
  logger.info("Fetching data");
  data = await Promise.all([erai.getData(), hs.getData()]);
  logger.info("Finished fetching data");
  data = data.flat().sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function resendPageData(win, refreshData) {
  if (refreshData) {
    await collectData();
  }
  logger.info("Sending data to render process");
  win.webContents.send("feed-data", data);
}

ipcMain.on("download", async (event, arg) => {
  logger.info(`Received download request for ${arg.title}`);
  if (arg.source == "HorribleSubs") {
    shell.openExternal(arg.link);
  } else {
    const magnet = await erai.getTorrentMagnet(arg);
    shell.openExternal(magnet);
  }
});

module.exports = {
  initialize,
  resendPageData
};
