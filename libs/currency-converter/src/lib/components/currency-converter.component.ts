import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';

import { debounceTime, Subscription, tap } from 'rxjs';
import { CardComponent } from '@ng-tool-collection/ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyConverterStore } from '../store/currency-converter.store';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'lib-currency-converter',
  imports: [CardComponent, ReactiveFormsModule, Select, InputText],
  providers: [CurrencyConverterStore],
  templateUrl: './currency-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private store = inject(CurrencyConverterStore);
  currencies = computed(() => this.store.currencies().map(([code, name]) => ({ name, code })));
  private fb = inject(FormBuilder);
  private fromCurrencies = computed(() => this.store.fromCurrency());
  private toCurrencies = computed(() => this.store.toCurrency());
  private amount = computed(() => this.store.computedAmount());
  private result = computed(() => this.store.computedResult());
  formGroup = this.fb.group({
    fromCurrency: this.fromCurrencies(),
    toCurrency: this.toCurrencies(),
    amount: this.amount(),
    result: this.result(),
  });

  constructor() {
    effect(() => {
      this.formGroup.patchValue({
        fromCurrency: this.fromCurrencies(),
        toCurrency: this.toCurrencies(),
        amount: this.amount(),
        result: this.result(),
      });
    });
  }

  ngOnInit() {
    const sub = this.formGroup.valueChanges
      .pipe(
        debounceTime(500),
        tap(state => this.store.updateStateFromForm(state)),
      )
      .subscribe();

    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
