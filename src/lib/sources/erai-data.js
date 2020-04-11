const axios = require("axios").default;
const moment = require("moment");
const parseTorrent = require("parse-torrent");
const fs = require("fs");
const { parseString } = require("../utils/xmlToJson");
const logger = require("../utils/logger");
const { baseDir } = require("../db/datastore");

async function getData() {
  try {
    logger.info("Fetching data from Erai-raws");
    const response = await axios.get("https://ru.erai-raws.info/rss-1080/");

    // The feed uses an 'en dash' which will be parsed as 'ΓÇô' instead of '–'
    response.data = response.data.replace(/&#8211;/g, "-");
    const res = await parseString(response.data);

    const data = [];
    for (const item of res.rss.channel[0].item) {
      const animeTitle = item.title[0]
        .replace("[1080p] ", "")
        .replace(/ - \d*.*/g, "") // Deling with titles such as '– 13 (HEVC)', '– 13v2', '– 02'
        .trim();
      data.push({
        title: item.title[0],
        animeTitle,
        episode: item.title[0].split(`${animeTitle} - `)[1],
        link: item.link[0],
        date: moment(item.pubDate[0]).unix(),
        source: "Erai-raws",
      });
    }

    return data;
  } catch (error) {
    logger.error(error.message);
    return [];
  }
}

async function getTorrentMagnet(item) {
  logger.info(`Fetching torrent data for ${item.title}`);
  const response = await axios({ method: "GET", url: item.link, responseType: "stream" });

  return new Promise(resolve => {
    const tempTorrentPath = `${baseDir}/temp.torrent`;
    logger.info(`Saving temporary torrent to ${tempTorrentPath}`);
    const stream = response.data.pipe(fs.createWriteStream(tempTorrentPath));
    stream.on("finish", () => {
      const torrentData = parseTorrent(fs.readFileSync(tempTorrentPath));
      fs.unlinkSync(tempTorrentPath);
      logger.info("Deleted temporary torrent");
      const magnetUri = parseTorrent.toMagnetURI(torrentData);
      resolve(magnetUri);
    });
  });
}

module.exports = { getData, getTorrentMagnet };
