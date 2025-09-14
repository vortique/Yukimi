using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;

namespace Yukimi
{
    public class MangaDex : IWebsiteService
    {
        public async Task<string> Search(string query)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                string path = Path.Combine(AppContext.BaseDirectory, "Models/StorageModels/ExampleUserProfile.json");

                var root = JSONHelper.DeserializeFromFile<WebsitesJSONModel.Root>(path);

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
