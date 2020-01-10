const axios = require("axios").default;
const moment = require("moment");
const { parseString } = require("./utils/xmlToJson");

async function getData() {
  const response = await axios.get("http://www.horriblesubs.info/rss.php?res=1080");
  const res = await parseString(response.data);

  const data = [];
  for (const item of res.rss.channel[0].item) {
    data.push({
      title: item.title[0],
      animeTitle: item.title[0]
        .replace("[HorribleSubs]", "")
        .replace("[1080p].mkv", "")
        .replace(/( - )\d* /g, "")
        .trim(),
      link: item.link[0],
      date: moment(item.pubDate[0]).unix(),
      source: "HorribleSubs"
    });
  }

  return data;
}

module.exports = { getData };
