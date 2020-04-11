const axios = require("axios").default;
const logger = require("../utils/logger");

async function getDetailForTitle(title) {
  const query = `
  {
    Media(search: "${title}", type: ANIME) {
      siteUrl
      description
      coverImage {
        large
        color
      }
    }
  }
  `;

  try {
    logger.info(`Fetching details of ${title.substr(0, 24)}...`);
    const res = await axios({
      method: "POST",
      url: "https://graphql.anilist.co/",
      data: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return {
      title,
      siteUrl: res.data.data.Media.siteUrl,
      description: res.data.data.Media.description,
      imageUrl: res.data.data.Media.coverImage.large,
      imageColor: res.data.data.Media.coverImage.color,
    };
  } catch (e) {
    logger.error(e.message);
    const statusCode = e.response.status;
    throw new Error(statusCode);
  }
}

module.exports = { getDetailForTitle };
