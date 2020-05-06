namespace PW.Core
{
    public class FlowOfFundsDto: TransferDocumentDto
    {
        public string SenderName { get; set; }
        public string RecipientName { get; set; }
        public decimal Balance { get; set; }
    }
}