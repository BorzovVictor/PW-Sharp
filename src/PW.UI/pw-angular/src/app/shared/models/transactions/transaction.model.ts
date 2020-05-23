export interface Transaction {
  id: number;
  dateTransfer: Date;
  corresponded: number;
  correspondedName: string;
  transactionType: number; // debit = 1, Credit = 2
  amount: number;
  balance: number;
  descriptions: string;
  baseDocumentId: number;
}
