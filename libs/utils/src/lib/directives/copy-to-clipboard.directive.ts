import { Directive, ElementRef, HostListener, inject, input, OnDestroy, output } from '@angular/core';
import { State } from '@ng-tool-collection/models';
import { copyToClipboard } from '../utils/copy-to-clipboard.utils';
import { catchError, of, Subscription, tap } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[copyToClipboard]',
})
export class CopyToClipboardDirective<T> implements OnDestroy {
  copyToClipboard = input<T>();

  copyError = output<State.ERROR>();
  success = output<State.SUCCESS>();
  copied = output<State.SUCCESS | State.ERROR>();

  private subscription: Subscription | undefined;
  private elementRef: ElementRef<T> = inject(ElementRef);

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('click')
  @HostListener('touchstart')
  copy() {
    const textToCopy = this.copyToClipboard() ?? (this.elementRef.nativeElement as HTMLElement).innerText;

    if (!textToCopy) {
      return;
    }

    this.subscription = copyToClipboard(textToCopy)
      .pipe(
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
