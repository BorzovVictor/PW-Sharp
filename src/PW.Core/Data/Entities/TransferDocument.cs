﻿using System;
 using PW.SharedKernel;

 namespace PW.Core.Entities
{
    public class TransferDocument: BaseEntity
    {
        public new long Id { get; set; }
        public DateTime DateTransfer { get; set; } = DateTime.Now;
        public int Sender { get; set; }
        public int Recipient { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}