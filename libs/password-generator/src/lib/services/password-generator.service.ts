import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { GenerationProperties, RandomFunc } from '@ng-tool-collection/models';
import { random, range, sample } from '@ng-tool-collection/utils';

@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService {
  // Precompute symbol characters once to avoid recomputation on each call
  private readonly symbols: string[] = this.createSymbolString();

  generatePassword = ({ length, ...args }: GenerationProperties) => {
    return of(args).pipe(
      map(args => Object.fromEntries(Object.entries(args).filter(([_, value]) => value))),
      map(filteredTypes => {
        if (Object.keys(filteredTypes).length === 0) return '';

        const typesArray = Object.entries(filteredTypes) as [keyof typeof filteredTypes, boolean][];
        return Array.from({ length }, () => {
          const [type] = sample(typesArray);
          return this.randomFunc[type as keyof RandomFunc]();
        }).join('');
      }),
    );
  };

  private createSymbolString() {
    const asciiCharsRanges: number[] = [...range(33, 48), ...range(58, 65), ...range(91, 97), ...range(123, 127)];
    return asciiCharsRanges.map(char => String.fromCharCode(char));
  }

  private getRandomChar = (start: number, end: number) => String.fromCharCode(random(start, end));

  private getRandomSymbol = (symbols: string[]) => symbols[random(0, symbols.length - 1)];

  private randomFunc: RandomFunc = {
    lower: () => this.getRandomChar(97, 122),
    upper: () => this.getRandomChar(65, 90),
    number: () => this.getRandomChar(48, 57),
    symbol: () => this.getRandomSymbol(this.symbols),
  };
}
