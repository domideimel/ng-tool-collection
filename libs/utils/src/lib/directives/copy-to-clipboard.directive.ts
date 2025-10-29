import { DestroyRef, Directive, ElementRef, inject, input, output } from '@angular/core';
import { State } from '@ng-tool-collection/models';
import { copyToClipboard } from '../utils/copy-to-clipboard.utils';
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[copyToClipboard]',
  host: {
    '(click)': 'copy()',
    '(touchstart)': 'copy()',
  },
})
export class CopyToClipboardDirective<T> {
  copyToClipboard = input<T>();
  copyError = output<State.ERROR>();
  success = output<State.SUCCESS>();
  copied = output<State.SUCCESS | State.ERROR>();
  private destroyRef = inject(DestroyRef);
  private elementRef: ElementRef<T> = inject(ElementRef);

  copy() {
    const textToCopy = this.copyToClipboard() ?? (this.elementRef.nativeElement as HTMLElement).innerText;

    if (!textToCopy) {
      return;
    }

    copyToClipboard(textToCopy)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.success.emit(State.SUCCESS)),
        tap(() => this.copied.emit(State.SUCCESS)),
        catchError(() => {
          this.copyError.emit(State.ERROR);
          this.copied.emit(State.ERROR);
          return of(null);
        }),
      )
      .subscribe();
  }
}
