namespace CongressionAppBot.App
{
    public class Payload
    {
        public Message[] Messages { get; set; }
        public double Temperature { get; set; }
        public double TopP { get; set; }
        public int MaxTokens { get; set; }
        public bool Stream { get; set; }
    }

    public class Message
    {
        public string Role { get; set; }
        public Content[] Content { get; set; }
    }

    public class Content
    {
        public string Type { get; set; }
        public string Text { get; set; }
    }
}