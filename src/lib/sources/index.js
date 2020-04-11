const logger = require("../utils/logger");
const erai = require("./erai-data");
const hs = require("./horrible-subs-data");
const anilist = require("./anilist");
const datastore = require("../db/datastore");

async function collectData() {
  logger.info("Fetching data");
  let data = await Promise.all([erai.getData(), hs.getData()]);
  data = data.flat().sort((a, b) => (a.date < b.date ? 1 : -1));

  return await getAnimeInfo(data);
}

async function getAnimeInfo(data) {
  logger.info("Fetching anime details");
  const promises = [];
  const alreadyFetched = [];

  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    // Check if the anime's details have already been saved
    const storeDetail = await datastore.findAnimeDetail(item.animeTitle);

    if (storeDetail == null) {
      // Avoid fetching details of the same anime twice.
      // Happens if:
      // - The feed contains two eposides of the same anime from the same source
      // - Both sources use the same name for the title e.g. both romanji
      if (!alreadyFetched.includes(item.animeTitle)) {
        // Add to an array of promises to allow fetching simultaneously
        promises.push(anilist.getDetailForTitle(item.animeTitle));
        alreadyFetched.push(item.animeTitle);
      } else {
        logger.info(`Aleardy fetched details of ${item.animeTitle.substr(0, 24)}`);
      }
    } else {
      data[index] = {
        ...item,
        siteUrl: storeDetail.siteUrl,
        description: storeDetail.description,
        imageUrl: storeDetail.imageUrl,
        imageColor: storeDetail.imageColor,
      };
    }
  }

  const res = await Promise.all(promises);
  res.forEach(r => {
    datastore.saveAnimeDetail(r.title, r.siteUrl, r.description, r.imageUrl, r.imageColor);
    const indexes = getAllIndexesOf(r.title, data);
    indexes.forEach(i => {
      data[i] = {
        ...data[i],
        siteUrl: r.siteUrl,
        description: r.description,
        imageUrl: r.imageUrl,
        imageColor: r.imageColor,
      };
    });
  });

  return data;
}

function getAllIndexesOf(title, data) {
  var indexes = [];
  for (var i = 0; i < data.length; i++) if (data[i].animeTitle === title) indexes.push(i);
  return indexes;
}

async function getEraiTorrentMagnet(item) {
  return erai.getTorrentMagnet(item);
}

module.exports = { collectData, getEraiTorrentMagnet };
