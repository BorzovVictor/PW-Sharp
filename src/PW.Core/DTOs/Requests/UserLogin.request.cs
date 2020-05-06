using System.ComponentModel.DataAnnotations;

namespace PW.Core
{
    public class UserLoginRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}