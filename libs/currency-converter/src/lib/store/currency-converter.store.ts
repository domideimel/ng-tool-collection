import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { Currencies, Currency } from '@ng-tool-collection/models';
import { computed, inject } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { catchError, debounceTime, distinctUntilChanged, map, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

type CurrencyConverterState = {
  fromCurrency: keyof Currencies | null | undefined;
  toCurrency: keyof Currencies | null | undefined;
  currencies: Array<[Currency, string]>;
  rates: Record<string, number>;
  amount: number | null;
  result: number | null;
  error?: string;
  loading: boolean;
};

type FormState = Partial<Omit<CurrencyConverterState, 'currencies' | 'error' | 'rates' | 'loading'>>;

const initialState: CurrencyConverterState = {
  fromCurrency: 'eur',
  toCurrency: 'usd',
  amount: 1,
  result: 1,
  currencies: [],
  rates: {},
  loading: false,
};

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
  })),
  withMethods(store => {
    const calculateResult = (amount: number | null, rates: Record<string, number>, toCurrency: string) => {
      if (amount === null || !rates[toCurrency]) return null;
      return Number((amount * rates[toCurrency]).toFixed(2));
    };

    const calculateAmount = (result: number | null, rates: Record<string, number>, toCurrency: string) => {
      if (result === null || !rates[toCurrency] || rates[toCurrency] === 0) return null;
      return Number((result / rates[toCurrency]).toFixed(2));
    };

    return {
      updateResult: () => {
        const result = calculateResult(store.amount(), store.rates(), store.toCurrency() ?? 'usd');
        patchState(store, { result });
      },
      updateAmount: () => {
        const amount = calculateAmount(store.result(), store.rates(), store.toCurrency() ?? 'usd');
        patchState(store, { amount });
      },
      loadRates: rxMethod<string>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, { loading: true })),
          switchMap(baseCurrency =>
            store.currencyService.getConversionList(baseCurrency).pipe(
              tap(resp => {
                const rates = (resp[baseCurrency] as Currencies) || {};
                patchState(store, { rates, loading: false });
                // Recalculate result after rates update
                const result = calculateResult(store.amount(), rates, store.toCurrency() ?? 'usd');
                patchState(store, { result });
              }),
              catchError((error: any) => {
                console.error(error);
                patchState(store, { error: error.message, loading: false });
                return of([]);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods(store => ({
    updateStateFromForm: (formState: FormState) => {
      const { fromCurrency, toCurrency, amount, result } = formState;
      let shouldRecalculateResult = false;
      let shouldRecalculateAmount = false;

      // From Currency Changed -> Fetch new rates
      if (fromCurrency && store.fromCurrency() !== fromCurrency) {
        patchState(store, { fromCurrency });
        store.loadRates(fromCurrency); // Will trigger recalculate result on success
        return;
      }

      // To Currency Changed -> Recalculate Result (Standard behavior)
      if (toCurrency && store.toCurrency() !== toCurrency) {
        patchState(store, { toCurrency });
        shouldRecalculateResult = true;
      }

      // Amount Changed -> Recalculate Result
      if (amount !== undefined && store.amount() !== amount) {
        patchState(store, { amount: Number(amount) });
        shouldRecalculateResult = true;
      }

      // Result Changed -> Recalculate Amount (Inverse)
      if (result !== undefined && store.result() !== result) {
        patchState(store, { result: Number(result) });
        shouldRecalculateAmount = true;
      }

      if (shouldRecalculateResult) {
        store.updateResult();
      } else if (shouldRecalculateAmount) {
        store.updateAmount();
      }
    },
  })),
  withHooks(store => ({
    onInit: () => {
      store.currencyService
        .getCurrencyList()
        .pipe(
          map(currencies => Object.entries(currencies) as Array<[Currency, string]>),
          tap(currencies => {
            patchState(store, { currencies });
          }),
          tap(() => {
            store.loadRates(store.fromCurrency() ?? 'eur');
          }),
          catchError(error => {
            patchState(store, { error: error.message });
            return [];
          }),
        )
        .subscribe();
    },
  })),
);
