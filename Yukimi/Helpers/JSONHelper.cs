using System.IO;
using System.Text.Json;
using System.Windows;

namespace Yukimi
{
    public static class JSONHelper
    {
        public static T Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json);
        }
        
        public static T DeserializeFromFile<T>(string path)
        {
            using (StreamReader sr = new StreamReader(path))
            {
                string content = sr.ReadToEnd();

                return JsonSerializer.Deserialize<T>(content);
            }
        }

        public static string Serialize(object obj, bool indented = false)
        {
            return JsonSerializer.Serialize(obj, new JsonSerializerOptions
            {
                WriteIndented = indented
            });
        }

        public static void SaveSerializedJSONToFile(string jsonContent, string path)
        {
            using (StreamWriter sw = new StreamWriter(path))
            {
                sw.WriteLine(jsonContent);
            }
        }

        public static void SerializeJSONAndSaveToFile(object obj, string path, bool indented = false)
        {
            var jsonContent = Serialize(obj, indented);

            SaveSerializedJSONToFile(jsonContent, path);
        }
    }
}
