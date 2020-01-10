const erai = require("./erai-data");
const hs = require("./horrible-subs-data");
const logger = require("./logger");

async function collectData() {
  logger.info("Fetching data");
  let data = await Promise.all([erai.getData(), hs.getData()]);
  logger.info("Finished fetching data");
  data = data.flat().sort((a, b) => (a.date < b.date ? 1 : -1));
  return data;
}

module.exports = {
  collectData
};
