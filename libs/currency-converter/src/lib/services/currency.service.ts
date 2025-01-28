import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency, Response } from '@ng-tool-collection/models';

const BASE_API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/';

@Injectable({
  providedIn: 'any',
})
export class CurrencyService {
  private http = inject(HttpClient);

  getCurrencyList() {
    return this.http.get<Record<Currency, string>>(`${BASE_API_URL}currencies.min.json`);
  }

  getConversionList(currency: string) {
    return this.http.get<Response>(`${BASE_API_URL}currencies/${currency}.min.json`);
  }
}
