using System.Text.Json.Serialization;

namespace Yukimi
{
    public class MangaDexAPIModel
    {
        public class AltTitle
        {
            public string ko { get; set; }
            public string en { get; set; }

            [JsonPropertyName("es-la")]
            public string esla { get; set; }
        }

        public class Attributes
        {
            public Title title { get; set; }
            public List<AltTitle> altTitles { get; set; }
            public Description description { get; set; }
            public bool isLocked { get; set; }
            public Links links { get; set; }
            public object officialLinks { get; set; }
            public string originalLanguage { get; set; }
            public string lastVolume { get; set; }
            public string lastChapter { get; set; }
            public string status { get; set; }
            public int year { get; set; }
            public string contentRating { get; set; }
            public List<Tag> tags { get; set; }
            public bool chapterNumbersResetOnNewVolume { get; set; }
            public List<string> availableTranslatedLanguages { get; set; }
            public string latestUploadedChapter { get; set; }
            public Name name { get; set; }
            public string group { get; set; }
        }

        public class Datum
        {
            public string id { get; set; }
            public string type { get; set; }
            public Attributes attributes { get; set; }
            public List<Relationship> relationships { get; set; }
        }

        public class Description
        {
            public string en { get; set; }
        }

        public class Links
        {
            public string raw { get; set; }
        }

        public class Name
        {
            public string en { get; set; }
        }

        public class Relationship
        {
            public string id { get; set; }
            public string type { get; set; }
        }

        public class Root
        {
            public List<Datum> data { get; set; }
            public int total { get; set; }
        }

        public class Tag
        {
            public string id { get; set; }
            public string type { get; set; }
            public Attributes attributes { get; set; }
            public List<object> relationships { get; set; }
        }

        public class Title
        {
            public string en { get; set; }
        }
    }
}
