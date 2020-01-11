const Datastore = require("nedb");
const imageDb = new Datastore({
  filename: "./data/anime-cache-db",
  autoload: true
});

async function saveAnimeDetail(title, imageUrl, imageColor, siteUrl) {
  return new Promise((resolve, reject) => {
    const data = { _id: title, title, imageUrl, imageColor, siteUrl };
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

module.exports = { saveAnimeDetail, findAnimeDetail };
