import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-currency-converter',
  imports: [CommonModule],
  templateUrl: './currency-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent {}
