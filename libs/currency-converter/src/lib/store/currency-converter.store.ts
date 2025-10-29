import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { Currencies, Currency } from '@ng-tool-collection/models';
import { computed, DestroyRef, inject } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { catchError, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
};
export type CurrencyConverterStoreType = InstanceType<typeof CurrencyConverterStore>;
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
  withProps(() => ({
    currencyService: inject(CurrencyService),
    destoryRef: inject(DestroyRef),
  })),
  withMethods(store => {
    const currencyService = store.currencyService;
    const destroyRef = store.destoryRef;
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
        currencyService
          .getConversionList(resultValue)
          .pipe(
            takeUntilDestroyed(destroyRef),
            map(resp => {
              return (resp[resultValue] as Currencies)[amountValue];
            }),
            tap(value => {
              if (!value) return;
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
        return;
      }

      currencyService
        .getConversionList(amountValue)
        .pipe(
          takeUntilDestroyed(destroyRef),
          map(resp => {
            return (resp[amountValue] as Currencies)[resultValue];
          }),
          tap(value => {
            if (!value) return;
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
    };

    return {
      updateStateFromForm,
      calculate,
    };
  }),
  withHooks(store => {
    const currencyService = store.currencyService;
    const destroyRef = store.destoryRef;
    return {
      onInit: () => {
        currencyService
          .getCurrencyList()
          .pipe(
            takeUntilDestroyed(destroyRef),
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
      },
    };
  }),
);
