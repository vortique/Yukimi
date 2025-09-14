using System.Text.Json.Serialization;

namespace Yukimi
{
    public class UserProfileModel
    {
        // Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);
        public class Root
        {
            [JsonPropertyName("user")]
            public User user { get; set; }
        }

        public class User
        {
            [JsonPropertyName("username")]
            public string username { get; set; }

            [JsonPropertyName("profile_picture")]
            public string profile_picture { get; set; }

            [JsonPropertyName("new_user")]
            public bool new_user { get; set; }
        }
    }
}
