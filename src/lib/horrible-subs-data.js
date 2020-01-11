const axios = require("axios").default;
const moment = require("moment");
const { parseString } = require("./utils/xmlToJson");
const logger = require("./logger");

async function getData() {
  logger.info("Fetching data from HorribleSubs");
  const response = await axios.get("http://www.horriblesubs.info/rss.php?res=1080");
  logger.info("Finished fetching data from HorribleSubs");
  const res = await parseString(response.data);

  const data = [];
  for (const item of res.rss.channel[0].item) {
    const animeTitle = item.title[0]
      .replace("[HorribleSubs]", "")
      .replace("[1080p].mkv", "")
      .replace(/( - )\d* /g, "")
      .trim();
    data.push({
      title: item.title[0],
      animeTitle,
      episode: item.title[0]
        .split(`${animeTitle} - `)[1]
        .split("[1080p]")[0]
        .trim(),
      link: item.link[0],
      date: moment(item.pubDate[0]).unix(),
      source: "HorribleSubs"
    });
  }

  return data;
}

module.exports = { getData };
