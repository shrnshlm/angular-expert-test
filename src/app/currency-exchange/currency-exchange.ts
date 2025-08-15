import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../services';
import type { ExchangeRate } from '../services';
import { interval, Subject, takeUntil, startWith, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-currency-exchange',
  imports: [CommonModule],
  templateUrl: './currency-exchange.html',
  styleUrl: './currency-exchange.scss'
})
export class CurrencyExchangeComponent implements OnInit, OnDestroy {
  private currencyService = inject(CurrencyService);
  private destroy$ = new Subject<void>();

  currentRate = signal<ExchangeRate | null>(null);
  previousRate = signal<number | null>(null);
  rateDirection = signal<'up' | 'down' | 'neutral'>('neutral');
  loading = signal(true);
  error = signal<string | null>(null);
  isPolling = signal(false);
  lastUpdate = signal<Date | null>(null);

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startPolling() {
    this.isPolling.set(true);
    
    interval(15000).pipe(
      startWith(0),
      takeUntil(this.destroy$),
      switchMap(() => {
        this.loading.set(true);
        this.error.set(null);
        
        return this.currencyService.getExchangeRate().pipe(
          catchError(error => {
            console.error('Currency exchange error:', error);
            this.error.set('Failed to fetch exchange rate. Check console for details.');
            this.loading.set(false);
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (rate) => {
        if (rate) {
          const previousRateValue = this.currentRate()?.rate || null;
          
          if (previousRateValue !== null) {
            this.previousRate.set(previousRateValue);
            
            if (rate.rate > previousRateValue) {
              this.rateDirection.set('up');
            } else if (rate.rate < previousRateValue) {
              this.rateDirection.set('down');
            } else {
              this.rateDirection.set('neutral');
            }
          } else {
            this.rateDirection.set('neutral');
          }
          
          this.currentRate.set(rate);
          this.lastUpdate.set(new Date());
          this.error.set(null);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Polling error:', error);
        this.error.set('Polling failed. Check console for details.');
        this.loading.set(false);
      }
    });
  }

  toggleMockMode() {
    if (this.currencyService.isMockMode) {
      this.currencyService.disableMockMode();
    } else {
      this.currencyService.enableMockMode();
    }
  }

  get isMockMode(): boolean {
    return this.currencyService.isMockMode;
  }

  get backoffDelay(): number {
    return this.currencyService.currentBackoffDelay;
  }

  getRateColorClass(): string {
    switch (this.rateDirection()) {
      case 'up':
        return 'exchange-rate-up';
      case 'down':
        return 'exchange-rate-down';
      default:
        return 'exchange-rate-neutral';
    }
  }

  getRateIcon(): string {
    switch (this.rateDirection()) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  }

  getRateAriaLabel(): string {
    switch (this.rateDirection()) {
      case 'up':
        return 'Rate increased';
      case 'down':
        return 'Rate decreased';
      default:
        return 'Rate unchanged';
    }
  }
}
