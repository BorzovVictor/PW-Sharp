export interface TransferDocument {
  id: number;
  dateTransfer: Date;
  sender: number;
  recipient: number;
  amount: number;
  description: string;
}
