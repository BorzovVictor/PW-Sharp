namespace PW.Core
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public decimal CurrentBalance { get; set; }
        public string Token { get; set; }
    }
}