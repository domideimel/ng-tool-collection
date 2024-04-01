import { Component, signal } from '@angular/core';
import { FormModel, GenerationProperties, RandomFunc } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { isEmpty, omitBy, random, range, sample } from 'lodash-es';

@Component({
  selector: 'lib-generator-form',
  templateUrl: './generator-form.component.html'
})
export class GeneratorFormComponent {
  formModel: FormModel = {
    items: [{
      label: 'Passwort Länge',
      controlName: 'length',
      type: 'range',
      value: 6,
      validators: [Validators.required, Validators.min(6), Validators.max(100)]
    }, {
      label: 'Großbuchstaben verwenden',
      controlName: 'upper',
      type: 'checkbox',
      value: true
    }, {
      label: 'Kleinbuchstaben verwenden',
      controlName: 'lower',
      type: 'checkbox',
      value: true
    }, {
      label: 'Sonderzeichen verwenden',
      controlName: 'symbol',
      type: 'checkbox',
      value: true
    }, {
      label: 'Zahlen verwenden',
      controlName: 'number',
      type: 'checkbox',
      value: true
    }],
    submitButtonLabel: 'Passwort generieren'
  };
  password = signal<string>('');

  onSubmit (value: GenerationProperties) {
    this.password.set(this.generatePassword(value));
  }

  async copyToClipboard () {
    await navigator.clipboard.writeText(this.password());
  }

  private createSymbolString (): string[] {
    const asciiCharsRanges: number[] = [...range(33, 48), ...range(58, 65), ...range(91, 97), ...range(123, 127)];
    return asciiCharsRanges.map(char => String.fromCharCode(char));
  }

  private getRandomChar = (start: number, end: number): string => String.fromCharCode(random(start, end));

  private getRandomSymbol = (symbols: string[] = this.createSymbolString()): string => symbols[random(0, symbols.length - 1)];

  private randomFunc: RandomFunc = {
    lower: () => this.getRandomChar(97, 122),
    upper: () => this.getRandomChar(65, 90),
    number: () => this.getRandomChar(48, 57),
    symbol: this.getRandomSymbol
  };

  private generatePassword = ({ length, ...args }: GenerationProperties): string => {
    const filteredTypes = omitBy(args, value => !value);
    if (isEmpty(filteredTypes)) return '';
    const typesArray = Object.entries(filteredTypes);

    return Array.from({ length }, () => {
      const [type] = sample(typesArray) as [keyof typeof filteredTypes, boolean];
      return this.randomFunc[type as keyof RandomFunc]();
    }).join('');
  };

}
