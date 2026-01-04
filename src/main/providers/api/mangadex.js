const { app } = require("electron");
const path = require("path");
const axios = require("axios");
const { createDirectory } = require("../../utils/io");
const { cache, getCachedData } = require("../../cache/cache");
const logger = require("../../utils/logger");

const baseUrl = "https://api.mangadex.org";

const searchUrl = `${baseUrl}/manga`;
const tagsUrl = `${searchUrl}/tag`;

const cachePath = path.join(app.getPath("userData"), "Cache", "MangaDex");

async function getTags() {
  try {
    const data = await getCachedData(cachePath, "tags");

    if (!data.success) {
      await createDirectory(cachePath);
      const resp = await axios(tagsUrl);
      const tags = resp.data.data.map((tag) => ({
        id: tag.id,
        name: tag.attributes.name.en,
      }));
      const ttl = 24 * 60 * 60 * 1000;
      await cache(cachePath, "tags", tags, ttl);

      return { success: true, tags: tags };
    }

    return { success: true, tags: data.content };
  } catch (e) {
    logger.error(`[mangadex.js/getTags] ${e.message}`);
    return { success: false, message: e.message };
  }
}

// function getOrderOptions() {
//   return {
//     name: {
//       Title: "title",
//       Year: "year",
//       "Created At": "createdAt",
//       "Updated At": "updatedAt",
//       "Latest Uploaded Chapter": "latestUploadedChapter",
//       "Followed Count": "followedCount",
//       Relevance: "relevance",
//     },
//     value: {
//       Ascending: "asc",
//       Descending: "desc",
//     },
//   };
// }

async function search(query, filterByTags = null) {
  const params = {};

  if (!query) {
    return { success: false, message: "No query provided." };
  }

  params.title = query;

  try {
    if (filterByTags) {
      const currentTags = await getTags();

      if (!currentTags.success)
        return { success: false, message: currentTags.message };

      const includedTagIDs = currentTags.tags
        .filter((tag) => filterByTags.includedTags.includes(tag.name))
        .map((tag) => tag.id);
      const excludedTagIDs = currentTags.tags
        .filter((tag) => filterByTags.excludedTags.includes(tag.name))
        .map((tag) => tag.id);

      params.includedTags = includedTagIDs;
      params.excludedTags = excludedTagIDs;
    }

    const resp = await axios({
      method: "GET",
      headers: {
        "User-Agent": navigator.userAgent,
      },
      url: searchUrl,
      params: params,
    });

    /**
     * @type {{
     *   id: number,
     *   title: string,
     *   altTitles: Array<Object<string, string>>,
     *   status: string,
     *   year: number
     * }[]}
     */
    const data = resp.data.data.map((item) => ({
      id: item.id,
      title: item.attributes.title[Object.keys(item.attributes.title)[0]],
      altTitles: item.attributes.altTitles,
      status: item.attributes.status,
      year: item.attributes.year,
    }));

    return { success: true, content: data };
  } catch (e) {
    logger.error(`[mangadex.js/search] ${e.message}`);
    return { success: false, message: e.message };
  }
}

module.exports = { search, getTags };
