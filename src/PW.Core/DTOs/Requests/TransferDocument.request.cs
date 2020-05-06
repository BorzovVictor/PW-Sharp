using System.ComponentModel.DataAnnotations;

namespace PW.Core
{
    public class TransferDocumentRequest
    {
        public int Sender { get; set; }
        [Required]
        public int Recipient { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Please enter a valid amount")]
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}