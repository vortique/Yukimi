const axios = require("axios");

const query = "Solo Leveling";

const baseUrl = "https://api.mangadex.org";

const searchUrl = `${baseUrl}/manga`;
const tagsUrl = `${searchUrl}/tag`;

async function test(query) {
  let params = {};

  if (!query) {
    return { success: false, message: "No query provided." };
  }

  params.title = query;

  // if (filterByTags) {
  //   const currentTags = await getTags();

  //   if (!currentTags.success)
  //     return { success: false, message: currentTags.message };

  //   const includedTagIDs = currentTags.tags
  //     .filter((tag) => filterByTags.includedTags.includes(tag.name))
  //     .map((tag) => tag.id);
  //   const excludedTagIDs = currentTags.tags
  //     .filter((tag) => filterByTags.excludedTags.includes(tag.name))
  //     .map((tag) => tag.id);

  //   params.includedTags = includedTagIDs;
  //   params.excludedTags = excludedTagIDs;
  // }

  const resp = await axios({
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    },
    url: searchUrl,
    params: params,
  });

  return resp.data;
}

test(query)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
