import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { CardComponent } from '@ng-tool-collection/ui';
import { InputText } from 'primeng/inputtext';
import { ConverterStore } from '../store/converter.store';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'lib-currency-converter',
  imports: [CardComponent, InputText, FormField],
  providers: [ConverterStore],
  templateUrl: './currency-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent {
  signalForm = form(this.signalFormGroup);
  private readonly converterStore = inject(ConverterStore);
  readonly currencies = computed(() => this.converterStore.currencies());
  readonly signalFormGroup = linkedSignal(() => ({
    fromCurrency: this.converterStore.fromCurrency() as string,
    toCurrency: this.converterStore.toCurrency() as string,
    amount: this.converterStore.amount() as number,
    result: this.converterStore.result() as number,
  }));
}
