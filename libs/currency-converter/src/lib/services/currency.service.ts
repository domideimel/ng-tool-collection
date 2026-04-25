import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency, CurrencySchema, Response, ResponseSchema } from '@ng-tool-collection/models';
import { defer, map } from 'rxjs';
import { record, safeParse, string } from 'valibot';

const BASE_API_URL = new URL('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/');
const CurrencyListSchema = record(CurrencySchema, string());
const INVALID_CURRENCY_RESPONSE_ERROR = new Error('Die Währungsdaten konnten nicht verifiziert werden.');
const INVALID_CURRENCY_CODE_ERROR = new Error('Ungültiger Währungscode.');

@Injectable({
  providedIn: 'any',
})
export class CurrencyService {
  private http = inject(HttpClient);

  getCurrencyList() {
    return this.http.get<unknown>(new URL('currencies.min.json', BASE_API_URL).toString()).pipe(
      map(response => {
        const parsedResponse = safeParse(CurrencyListSchema, response);

        if (!parsedResponse.success) {
          throw INVALID_CURRENCY_RESPONSE_ERROR;
        }

        return parsedResponse.output as Record<Currency, string>;
      }),
    );
  }

  getConversionList(currency: string) {
    return defer(() => {
      const normalizedCurrency = this.normalizeCurrency(currency);

      return this.http
        .get<unknown>(new URL(`currencies/${encodeURIComponent(normalizedCurrency)}.min.json`, BASE_API_URL).toString())
        .pipe(
          map(response => {
            const parsedResponse = safeParse(ResponseSchema, response);

            if (!parsedResponse.success || !(normalizedCurrency in parsedResponse.output)) {
              throw INVALID_CURRENCY_RESPONSE_ERROR;
            }

            return parsedResponse.output as Response;
          }),
        );
    });
  }

  private normalizeCurrency(currency: string): Currency {
    const parsedCurrency = safeParse(CurrencySchema, currency.trim().toLowerCase());

    if (!parsedCurrency.success) {
      throw INVALID_CURRENCY_CODE_ERROR;
    }

    return parsedCurrency.output;
  }
}
