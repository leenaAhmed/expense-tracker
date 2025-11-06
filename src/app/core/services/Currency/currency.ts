import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private apiUrl = 'https://open.er-api.com/v6/latest/USD';
  private cache = new Map<string, { rate: number; timestamp: number }>();
  private CACHE_DURATION = 3600000; // 1 hour

  constructor(private http: HttpClient) {}

  convertToUSD(amount: number, fromCurrency: string): Observable<number> {
    if (fromCurrency === 'USD') {
      return of(amount);
    }

    const cached = this.cache.get(fromCurrency);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of(amount / cached.rate);
    }

    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const rate = response.rates[fromCurrency];
        this.cache.set(fromCurrency, { rate, timestamp: Date.now() });
        return amount / rate;
      }),
      catchError(error => {
        console.error('Currency conversion failed', error);
        return of(amount); // Fallback
      })
    );
  }
}