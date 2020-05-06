using System;

namespace PW.Core
{
    public class TransactionDto
    {
        public long Id { get; set; }
        public DateTime DateTransfer { get; set; }
        public int Corresponded { get; set; }
        public string CorrespondedName { get; set; }
        public TransactionType TransactionType { get; set; }
        public decimal Amount { get; set; }
        public decimal Balance { get; set; }
        public string Descriptions { get; set; }
        public long BaseDocumentId { get; set; }
    }
}