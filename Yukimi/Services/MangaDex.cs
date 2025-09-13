using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace Yukimi
{
    public static class MangaDex
    {
        public static async Task<string> Search(string query)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                var root = JSONHelper.DeserializeFromFile<WebsitesJSONModel.Root>("pack://application:,,,/WebsiteResources/websites.json");

                string url = root.websites.mangadexorg.api.base_url
                    + root.websites.mangadexorg.api.search_endpoint;

                HttpResponseMessage response = await httpClient.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();

                    return content;
                }

                return string.Empty;
            }
        }
    }
}
