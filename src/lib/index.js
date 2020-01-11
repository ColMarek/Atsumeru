const { shell, ipcMain } = require("electron");
const erai = require("./erai-data");
const hs = require("./horrible-subs-data");
const logger = require("./logger");
const datastore = require("./datastore");
const anilist = require("./anilist");

let data = [];

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

  await getImages();
}

async function resendPageData(win, refreshData) {
  if (refreshData) {
    await collectData();
  }
  logger.info("Sending data to render process");
  win.webContents.send("feed-data", data);
}

async function getImages() {
  const promises = [];
  const alreadySearchedFor = [];

  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const storeDetail = await datastore.findAnimeDetail(item.animeTitle);

    if (storeDetail == null) {
      // Avoid searching for the same anime twice.
      // Happens if:
      // - The feed contains two eposides of the same anime form the same source
      // - Both sources use the same name for the title e.g. both romanji
      if (!alreadySearchedFor.includes(item.animeTitle)) {
        console.log(item.animeTitle);
        promises.push(anilist.getDetailForTitle(item.animeTitle));
        alreadySearchedFor.push(item.animeTitle);
      } else {
        logger.info(`Aleardy fetched detail for ${item.animeTitle.substr(0, 24)}`);
      }
    } else {
      data[index] = { ...item, imageUrl: storeDetail.imageUrl, imageColor: storeDetail.imageColor };
    }
  }

  const res = await Promise.all(promises);
  res.forEach(r => {
    datastore.saveAnimeDetail(r.title, r.imageUrl, r.imageColor, r.siteUrl);
    const indexes = getAllIndexesOf(r.title);
    indexes.forEach(i => {
      data[i] = { ...data[i], imageUrl: r.imageUrl, imageColor: r.imageColor };
    });
  });
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

function getAllIndexesOf(title) {
  var indexes = [];
  for (var i = 0; i < data.length; i++) if (data[i].animeTitle === title) indexes.push(i);
  return indexes;
}

module.exports = {
  initialize,
  resendPageData
};
