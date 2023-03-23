using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration;

namespace Gunny.Helper
{
    public class Users
    {
        private string _doamin = "";
        public Users()
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            _doamin = config["Domain:Url"];
        }
        public async Task<dynamic> TopHome()
        {

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(_doamin);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string url = "/api/user/top";
                var responseMessage = await httpClient.GetAsync(url);
                if (responseMessage.IsSuccessStatusCode)
                {
                    string responseBody = await responseMessage.Content.ReadAsStringAsync();
                    dynamic output = JsonConvert.DeserializeObject(responseBody);

                    return output;
                }
                else
                {
                    return null;
                }
            }
        }

        public async Task<dynamic> ListUser(int page)
        {

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(_doamin);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string url = "/api/user/all/"+ page;
                var responseMessage = await httpClient.GetAsync(url);
                if (responseMessage.IsSuccessStatusCode)
                {
                    string responseBody = await responseMessage.Content.ReadAsStringAsync();
                    dynamic output = JsonConvert.DeserializeObject(responseBody);

                    return output;
                }
                else
                {
                    return null;
                }
            }
        }

        public async Task<dynamic> SearchListUser(int page, string search)
        {

            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(_doamin);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string url = "/api/user/search/"+search+"/" + page;
                var responseMessage = await httpClient.GetAsync(url);
                if (responseMessage.IsSuccessStatusCode)
                {
                    string responseBody = await responseMessage.Content.ReadAsStringAsync();
                    dynamic output = JsonConvert.DeserializeObject(responseBody);

                    return output;
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
