import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Currencies, Currency } from '@ng-tool-collection/models';
import { computed, inject } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { catchError, map, Subscription, tap } from 'rxjs';

type CurrencyConverterState = {
  fromCurrency: keyof Currencies | null | undefined;
  toCurrency: keyof Currencies | null | undefined;
  currencies: Array<[Currency, string]>;
  amount: number | null;
  result: number | null;
  error?: string;
};

type FormState = Partial<Omit<CurrencyConverterState, 'currencies' | 'error'>>;

const initialState: CurrencyConverterState = {
  fromCurrency: 'eur',
  toCurrency: 'usd',
  amount: 1,
  result: 1,
  currencies: [],
  error: undefined,
};

const subscriptions: Subscription[] = [];
export const CurrencyConverterStore = signalStore(
  withState<CurrencyConverterState>(initialState),
  withComputed(store => {
    const computedAmount = computed(() => store.amount());
    const computedResult = computed(() => store.result());
    return {
      computedAmount,
      computedResult,
    };
  }),
  withMethods(store => {
    const currencyService = inject(CurrencyService);
    const updateStateFromForm = ({ fromCurrency, toCurrency, amount, result }: FormState) => {
      if (store.fromCurrency() !== fromCurrency) {
        patchState(store, state => ({ ...state, fromCurrency }));
        calculate();
      }

      if (store.toCurrency() !== toCurrency) {
        patchState(store, state => ({ ...state, toCurrency }));
        calculate(true);
      }

      if (store.amount() !== amount) {
        patchState(store, state => ({ ...state, amount: Number(amount) }));
        calculate();
      }

      if (store.result() !== result) {
        patchState(store, state => ({ ...state, result: Number(result) }));
        calculate(true);
      }
    };
    const calculate = (isResult = false) => {
      const resultValue = store.toCurrency() ?? 'usd';
      const amountValue = store.fromCurrency() ?? 'eur';

      if (isResult) {
        const resultSub = currencyService
          .getConversionList(resultValue)
          .pipe(
            map(resp => {
              return (resp[resultValue] as Currencies)[amountValue];
            }),
            tap(value => {
              const result = value * (store.result() ?? 1);
              patchState(store, state => ({ ...state, amount: Number(result.toFixed(2)) }));
            }),
            catchError(error => {
              console.log(error);
              patchState(store, state => ({ ...state, error: error.message }));
              return [];
            }),
          )
          .subscribe();
        subscriptions.push(resultSub);
        return;
      }

      const amountSub = currencyService
        .getConversionList(amountValue)
        .pipe(
          map(resp => {
            return (resp[amountValue] as Currencies)[resultValue];
          }),
          tap(value => {
            const result = value * (store.amount() ?? 1);
            patchState(store, state => ({ ...state, result: Number(result.toFixed(2)) }));
          }),
          catchError(error => {
            console.log(error);
            patchState(store, state => ({ ...state, error: error.message }));
            return [];
          }),
        )
        .subscribe();
      subscriptions.push(amountSub);
    };

    return {
      updateStateFromForm,
      calculate,
    };
  }),
  withHooks(store => {
    const currencyService = inject(CurrencyService);
    return {
      onInit: () => {
        const initialCurrencySub = currencyService
          .getCurrencyList()
          .pipe(
            map(currencies => Object.entries(currencies) as Array<[Currency, string]>),
            tap(currencies => {
              patchState(store, state => ({ ...state, currencies }));
            }),
            tap(() => {
              store.calculate();
            }),
            catchError(error => {
              patchState(store, state => ({ ...state, error: error.message }));
              return [];
            }),
          )
          .subscribe();
        subscriptions.push(initialCurrencySub);
      },
      onDestroy: () => {
        subscriptions.forEach(sub => sub?.unsubscribe());
      },
    };
  }),
);
