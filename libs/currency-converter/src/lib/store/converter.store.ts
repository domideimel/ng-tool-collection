import { signalStore, withComputed, withProps, withState } from '@ngrx/signals';
import { Currencies, Currency } from '@ng-tool-collection/models';
import { computed, inject } from '@angular/core';
import { withResource } from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyService } from '../services/currency.service';
import { map } from 'rxjs';

const initialState = {
  fromCurrency: 'eur' as keyof Currencies,
  toCurrency: 'usd' as keyof Currencies,
  amount: 0 as number,
  result: 0 as number,
};

export const ConverterStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _currencyService: inject(CurrencyService),
  })),
  withResource(store => {
    const currencyList = store._currencyService
      .getCurrencyList()
      .pipe(map(currencies => Object.entries(currencies) as Array<[Currency, string]>));
    const currencyListRessource = rxResource({
      stream: () => currencyList,
    });

    return {
      currencyListRessource,
    };
  }),
  withComputed(store => {
    const currencies = computed(() => store?.currencyListRessourceValue()?.map(([code, name]) => ({ name, code })));
    return { currencies };
  }),
);
