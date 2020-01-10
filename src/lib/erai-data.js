const axios = require("axios").default;
const moment = require("moment");
const { parseString } = require("./utils/xmlToJson");
const logger = require("./logger");

async function getData() {
  logger.info("Fetching data from Erai-raws");
  const response = await axios.get("https://ru.erai-raws.info/rss-1080/");
  logger.info("Finished fetching data from Erai-raws");

  // The feed uses an en dash which will be parsed as ΓÇô instead of –
  response.data = response.data.replace(/&#8211;/g, "-");
  const res = await parseString(response.data);

  const data = [];
  for (const item of res.rss.channel[0].item) {
    data.push({
      title: item.title[0],
      animeTitle: item.title[0]
        .replace("[1080p] ", "")
        .replace(/ - \d*.*/g, "") // – 13 (HEVC),  – 13v2,  – 02
        .trim(),
      link: item.link[0],
      date: moment(item.pubDate[0]).unix(),
      source: "Erai-raws"
    });
  }

  return data;
}

module.exports = { getData };
