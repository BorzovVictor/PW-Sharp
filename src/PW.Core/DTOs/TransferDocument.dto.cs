using System;

namespace PW.Core
{
    public class TransferDocumentDto
    {
        public long Id { get; set; }
        public DateTime DateTransfer { get; set; }
        public int Sender { get; set; }
        public int Recipient { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}