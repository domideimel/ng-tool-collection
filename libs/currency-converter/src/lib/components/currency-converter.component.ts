import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';

import { debounceTime, tap } from 'rxjs';
import { CardComponent, SignalFormComponent } from '@ng-tool-collection/ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyConverterStore } from '../store/currency-converter.store';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalFormModel } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-currency-converter',
  imports: [CardComponent, ReactiveFormsModule, Select, InputText, SignalFormComponent],
  providers: [CurrencyConverterStore],
  templateUrl: './currency-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent implements OnInit {
  private store = inject(CurrencyConverterStore);
  currencies = computed(() => this.store.currencies().map(([code, name]) => ({ name, code })));
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private fromCurrencies = computed(() => this.store.fromCurrency());
  private toCurrencies = computed(() => this.store.toCurrency());
  private amount = computed(() => this.store.computedAmount());
  private result = computed(() => this.store.computedResult());

  readonly formConfig: SignalFormModel = {
    items: [
      {
        controlName: 'some input',
        label: 'label',
        type: 'text',
      },
    ],
    submitButtonLabel: 'Hallo Welt',
  };

  formGroup = this.fb.group({
    fromCurrency: this.fromCurrencies(),
    toCurrency: this.toCurrencies(),
    amount: this.amount(),
    result: this.result(),
  });

  constructor() {
    effect(() => {
      this.formGroup.patchValue(
        {
          fromCurrency: this.fromCurrencies(),
          toCurrency: this.toCurrencies(),
          amount: this.amount(),
          result: this.result(),
        },
        { emitEvent: false },
      );
    });
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        tap(state => this.store.updateStateFromForm(state)),
      )
      .subscribe();
  }
}
