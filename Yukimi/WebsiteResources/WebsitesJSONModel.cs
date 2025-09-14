using System.Text.Json.Serialization;

namespace Yukimi
{
    public class WebsitesJSONModel
    {
        public class Api
        {
            [JsonPropertyName("base_url")]
            public string base_url { get; set; }

            [JsonPropertyName("search_endpoint")]
            public string search_endpoint { get; set; }
        }

        public class MangadexOrg
        {
            [JsonPropertyName("website_url")]
            public string website_url { get; set; }

            [JsonPropertyName("icon")]
            public string icon { get; set; }

            [JsonPropertyName("api")]
            public Api api { get; set; }
        }

        public class Root
        {
            [JsonPropertyName("websites")]
            public Websites websites { get; set; }
        }

        public class Websites
        {
            [JsonPropertyName("mangadex.org")]
            public MangadexOrg mangadexorg { get; set; }
        }
    }
}
