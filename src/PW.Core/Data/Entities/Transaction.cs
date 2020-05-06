using System;
using PW.SharedKernel;

namespace PW.Core.Entities
{
    public class Transaction: BaseEntity
    {
        public new long Id { get; set; }
        public long? TransferDocumentId { get; set; }
        public DateTime DateTransfer { get; set; }
        public int Corresponded { get; set; }
        public TransactionType TransactionType { get; set; }
        public decimal Amount { get; set; }
        public decimal CurrentBalance { get; set; }
    }
}