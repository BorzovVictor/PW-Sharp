using PW.SharedKernel;

namespace PW.Core.Entities
{
    public class User: BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public decimal CurrentBalance { get; set; }
    }
}