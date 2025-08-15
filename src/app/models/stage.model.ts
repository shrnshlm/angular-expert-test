export interface Stage {
  id: string;
  title: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
}