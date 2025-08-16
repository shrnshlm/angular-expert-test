import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, Stage } from '../models';

@Component({
  selector: 'app-responsive-page',
  imports: [CommonModule],
  templateUrl: './responsive-page.html',
  styleUrl: './responsive-page.scss'
})
export class ResponsivePageComponent {
  currentBalance = signal(-174.00);
  totalBalance = signal(-348.00);

  stages = signal<Stage[]>([
    {
      id: '1',
      title: 'סוג כרטיס, מוצא ויעד',
      icon: '✓',
      status: 'completed'
    },
    {
      id: '2',
      title: 'נוסעים',
      icon: '✓',
      status: 'completed'
    },
    {
      id: '3',
      title: 'מועד וקו',
      icon: '✓',
      status: 'completed'
    },
    {
      id: '4',
      title: 'סיכום ותשלום',
      icon: '4',
      status: 'active'
    }
  ]);

  transactions = signal<Transaction[]>([
    {
      id: '1',
      date: '25/06/2022',
      description: 'העברה בנקאית',
      reference: 'משכנתא 1',
      amount: 150.00,
      status: 'completed',
      type: 'credit'
    }
  ]);

  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }
}
