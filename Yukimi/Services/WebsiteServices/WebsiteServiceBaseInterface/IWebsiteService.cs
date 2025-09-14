using System.Net.Http;

namespace Yukimi
{
    public interface IWebsiteService
    {
        public async Task<string> Search(string query)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                return string.Empty;
            }
        }
    }
}
