using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CongressionAppBot
{

    public class ChatBotService
    {
        private const string API_KEY = "API_Key";
        private const string ENDPOINT = "https://yourdomain.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview";

        public ChatBotService() { }

        public async Task<string> GetChatAsync(string promptQuestion)
        {
            object payload = CreatePayload(promptQuestion);
            string serializedPayload = JsonConvert.SerializeObject(payload);
            StringContent content = new StringContent(serializedPayload, Encoding.UTF8, "application/json");
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("api-key", API_KEY);
                HttpResponseMessage response = await httpClient.PostAsync(ENDPOINT, content);
                if (response.IsSuccessStatusCode)
                {
                    string output = await response.Content.ReadAsStringAsync();
                    Response jsonResponse = JsonConvert.DeserializeObject<Response>(output);
                    string messageContent = jsonResponse.Choices[0].Message.Content;
                    return messageContent;
                }
                Console.WriteLine($"Error: {response.StatusCode}, {response.ReasonPhrase}");
                return $"Error: {response.StatusCode}, {response.ReasonPhrase}";
            }
        }

        private static object CreatePayload(string question)
        {
            var payload = new
            {
                messages = new object[]
                    {
                  new {
                      role = "system",
                      content = new object[] {
                          new {
                              type = "text",
                              text = "You are an AI assistant that helps people find information."
                          }
                      }
                  },
                  new {
                      role = "user",
                      content = new object[] {
                          new {
                              type = "text",
                              text = question
                          }
                      }
                  }
                    },
                temperature = 0.7,
                top_p = 0.95,
                max_tokens = 800,
                stream = false
            };
            return payload;
        }

    }

    public class Response
    {
        [JsonProperty("choices")]
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        [JsonProperty("message")]
        public Message Message { get; set; }
    }

    public class Message
    {
        [JsonProperty("content")]
        public string Content { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }
    }
}