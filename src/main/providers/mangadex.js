const { app } = require("electron");
const path = require("path");
const axios = require("axios");
const { createDirectory } = require("../utils/io");
const { cache, getCachedData } = require("../cache/cache");
const logger = require("../utils/logger");

const coverArtUrl = "https://uploads.mangadex.org/covers";
const coverFileNameUrl = "https://api.mangadex.org/cover";
const baseUrl = "https://api.mangadex.org";

const searchUrl = `${baseUrl}/manga`;
const tagsUrl = `${searchUrl}/tag`;

const cachePath = path.join(
  app.getPath("userData"),
  "Cache",
  "MangaDex",
  "General"
);
const imageCachePath = path.join(
  app.getPath("userData"),
  "Cache",
  "MangaDex",
  "Image"
);

async function getTags() {
  try {
    const data = await getCachedData(cachePath, "tags");

    if (!data.success) {
      const filePath = path.join(
        await createDirectory(cachePath),
        ".mangadex.tags.json"
      );
      const resp = await axios(tagsUrl);
      const tags = resp.data.data.map((tag) => ({
        id: tag.id,
        name: tag.attributes.name.en,
      }));
      const ttl = 24 * 60 * 60 * 1000;
      await cache(filePath, "tags", tags, ttl);

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

async function getCoverImage(mangaIds, coverArtIds) {
  const fileNameResp = await axios.get(`${coverFileNameUrl}`, {
    params: {
      limit: 20,
      manga: mangaIds,
      ids: coverArtIds,
    },
    headers: { "User-Agent": navigator.userAgent },
  });

  const coverMap = new Map();

  for (const cover of fileNameResp.data.data) {
    const mangaRel = cover.relationships.find((r) => r.type === "manga");

    if (!mangaRel) continue;

    coverMap.set(mangaRel.id, cover.attributes.fileName);
  }

  const coverUrls = mangaIds.map((id) => {
    const fileName = coverMap.get(id);
    if (!fileName) return null;

    return `${coverArtUrl}/${id}/${fileName}`;
  });

  return coverUrls;
}

async function search(query, offset = 0, filterByTags = null) {
  const params = {
    offset: offset,
    limit: 20,
  };

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

    const resp = await axios.get(searchUrl, {
      headers: {
        "User-Agent": navigator.userAgent,
      },
      params: params,
    });

    const manga_ids = resp.data.data.map((item) => item.id);
    const cover_art_ids = resp.data.data.map(
      (item) => item.relationships.find((r) => r.type === "cover_art").id
    );

    const covers = await getCoverImage(manga_ids, cover_art_ids);

    /**
     * @type {{
     *   id: number,
     *   title: string,
     *   altTitles: Array<Object<string, string>>,
     *   status: string,
     *   year: number,
     *   cover_art: string
     * }[]}
     */
    const data = resp.data.data.map((item) => {
      return {
        id: item.id,
        title: item.attributes.title[Object.keys(item.attributes.title)[0]],
        altTitles: item.attributes.altTitles,
        status: item.attributes.status,
        year: item.attributes.year,
        cover_art: covers.find((c) => c.includes(item.id)),
      };
    });

    return { success: true, content: data };
  } catch (e) {
    logger.error(`[mangadex.js/search] ${e.message}`);
    return { success: false, message: e.message };
  }
}

module.exports = {
  name: "mangadex",
  search: async (query, offset) => await search(query, offset),
};
