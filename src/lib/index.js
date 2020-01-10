const erai = require("./erai-data");
const hs = require("./horrible-subs-data");
const logger = require("./logger");

let data = null;

async function initialize(win) {
  try {
    await collectData();
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

module.exports = {
  initialize,
  resendPageData
};
