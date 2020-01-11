const axios = require("axios").default;
const logger = require("./logger");

async function getDetailForTitle(title) {
  const query = `
  {
    Media(search: "${title}", type: ANIME) {
      siteUrl
      coverImage {
        large
        color
      }
    }
  }
  `;

  try {
    const res = await axios({
      method: "POST",
      url: "https://graphql.anilist.co/",
      data: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    logger.info(`Fetched image for ${title.substr(0, 24)}...`);

    return {
      title,
      imageUrl: res.data.data.Media.coverImage.large,
      imageColor: res.data.data.Media.coverImage.color,
      siteUrl: res.data.data.Media.siteUrl
    };
  } catch (e) {
    const statusCode = e.response.status;
    throw new Error(statusCode);
  }
}

module.exports = { getDetailForTitle };
