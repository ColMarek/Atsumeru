const xml2js = require("xml2js");

async function parseString(string) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(string, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = { parseString };
