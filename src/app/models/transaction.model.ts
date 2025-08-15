export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'credit' | 'debit';
}