const erai = require("./erai-data");
const hs = require("./horrible-subs-data");

async function collectData() {
  let data = await Promise.all([erai.getData(), hs.getData()]);
  data = data.flat().sort((a, b) => (a.date < b.date ? 1 : -1));
}

module.exports = {
  collectData
};
