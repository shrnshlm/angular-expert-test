import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer, catchError, retry, switchMap, tap } from 'rxjs';

export interface CurrencyExchangeResponse {
  "Realtime Currency Exchange Rate": {
    "1. From_Currency Code": string;
    "2. From_Currency Name": string;
    "3. To_Currency Code": string;
    "4. To_Currency Name": string;
    "5. Exchange Rate": string;
    "6. Last Refreshed": string;
    "7. Time Zone": string;
    "8. Bid Price": string;
    "9. Ask Price": string;
  };
}

export interface ExchangeRate {
  rate: number;
  lastRefreshed: string;
  fromCurrency: string;
  toCurrency: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo';
  private mockMode = false;
  private mockRate = 150.5;
  private backoffDelay = 5000;
  private maxBackoff = 60000;

  getExchangeRate(): Observable<ExchangeRate> {
    if (this.mockMode) {
      return this.getMockExchangeRate();
    }

    return this.http.get<CurrencyExchangeResponse>(this.apiUrl).pipe(
      tap(() => {
        this.backoffDelay = 5000;
      }),
      switchMap((response: CurrencyExchangeResponse) => {
        const exchangeData = response["Realtime Currency Exchange Rate"];
        const rate: ExchangeRate = {
          rate: parseFloat(exchangeData["5. Exchange Rate"]),
          lastRefreshed: exchangeData["6. Last Refreshed"],
          fromCurrency: exchangeData["1. From_Currency Code"],
          toCurrency: exchangeData["3. To_Currency Code"]
        };
        return of(rate);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          console.warn('Rate limit hit, increasing backoff delay');
          this.backoffDelay = Math.min(this.backoffDelay * 2, this.maxBackoff);
          
          if (this.backoffDelay >= this.maxBackoff) {
            console.warn('Switching to mock mode due to persistent rate limiting');
            this.mockMode = true;
            return this.getMockExchangeRate();
          }
        }
        throw error;
      }),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error.status === 429) {
            return timer(this.backoffDelay);
          }
          return timer(1000 * Math.pow(2, retryCount));
        }
      })
    );
  }

  private getMockExchangeRate(): Observable<ExchangeRate> {
    this.mockRate += (Math.random() - 0.5) * 2;
    
    return of({
      rate: Math.round(this.mockRate * 100) / 100,
      lastRefreshed: new Date().toISOString(),
      fromCurrency: 'USD',
      toCurrency: 'JPY'
    });
  }

  enableMockMode() {
    this.mockMode = true;
  }

  disableMockMode() {
    this.mockMode = false;
    this.backoffDelay = 5000;
  }

  get isMockMode(): boolean {
    return this.mockMode;
  }

  get currentBackoffDelay(): number {
    return this.backoffDelay;
  }
}
