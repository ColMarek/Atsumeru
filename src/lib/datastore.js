const Datastore = require("nedb");
const fs = require("fs");
const logger = require("./logger");

const imageDb = new Datastore({
  filename: "./data/anime-cache-db",
  autoload: true
});

function intialize() {
  const expectedVersion = 3;
  const actualVersion = fs.readFileSync("./data/db-version").toString();

  if (actualVersion != expectedVersion) {
    logger.info("Clearing anime-cache-db");
    fs.unlinkSync("./data/anime-cache-db");
    fs.writeFileSync("./data/db-version", expectedVersion);
  }
}

async function saveAnimeDetail(title, siteUrl, description, imageUrl, imageColor) {
  return new Promise((resolve, reject) => {
    const data = { _id: title, title, siteUrl, description, imageUrl, imageColor };
    imageDb.insert(data, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
}

async function findAnimeDetail(title) {
  return new Promise((resolve, reject) => {
    imageDb.find({ _id: title }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        if (doc.length == 0) {
          resolve(null);
        } else {
          resolve(doc[0]);
        }
      }
    });
  });
}

module.exports = { intialize, saveAnimeDetail, findAnimeDetail };
