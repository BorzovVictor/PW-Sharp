using System.ComponentModel.DataAnnotations;

namespace PW.Core
{
    public class UserRegisterRequest
    {
        [Required(ErrorMessage = "user name required")]
        [StringLength(255, ErrorMessage = "username must be greater than 2 less than 255 characters", MinimumLength = 3)]
        public string UserName { get; set; }
        [Required(ErrorMessage = "email required")]
        [RegularExpression("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$", ErrorMessage = "valid email required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "password is required")]
        [StringLength(255, ErrorMessage = "password must be longer than 3 and less than 255 characters", MinimumLength = 4)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required(ErrorMessage = "password confirmation required")]
        [StringLength(255, ErrorMessage = "password must be longer than 3 and less than 255 characters", MinimumLength = 4)]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "passwords do not match")]
        public string ConfirmPassword { get; set; }
    }
}