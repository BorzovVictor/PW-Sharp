namespace PW.Infrastructure
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public int? LifeTimeMinutes { get; set; }
        public static string DbSchema { get; set; } = "PW";
        public decimal StartBalance { get; set; } = 500;
        public int PasswordRequiredLength { get; set; } = 4;
    }
}