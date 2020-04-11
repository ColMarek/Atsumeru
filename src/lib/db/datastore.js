const { app } = require("electron");
const path = require("path");
const Datastore = require("nedb");
const fs = require("fs");
const logger = require("../utils/logger");

const baseDir = app.isPackaged ? path.normalize(`${app.getPath("userData")}/data`) : "./data";
const dbVersionPath = path.normalize(`${baseDir}/db-version`);

const imageDb = new Datastore({
  filename: `${baseDir}/anime-cache-db`,
  autoload: true,
});

function intialize() {
  const expectedVersion = 1;

  if (fs.existsSync(dbVersionPath)) {
    const actualVersion = fs.readFileSync(dbVersionPath).toString();
    if (actualVersion != expectedVersion) {
      logger.info("Clearing anime-cache-db");
      fs.unlinkSync(`${baseDir}/anime-cache-db`);
      fs.writeFileSync(dbVersionPath, expectedVersion);
    }
  } else {
    logger.info("Creating anime-cache-db");
    fs.writeFileSync(dbVersionPath, expectedVersion);
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

module.exports = { intialize, saveAnimeDetail, findAnimeDetail, baseDir };
