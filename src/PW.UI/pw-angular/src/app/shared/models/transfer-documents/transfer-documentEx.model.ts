export interface TransferDocumentExModel {
  id: number;
  dateTransfer: Date;
  sender: number;
  senderName: string;
  recipient: number;
  recipientName: string;
  amount: number;
  balance: number;
  description: string;
}
