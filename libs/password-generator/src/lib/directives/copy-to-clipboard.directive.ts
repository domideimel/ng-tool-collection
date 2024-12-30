import { Directive, ElementRef, HostListener, inject, input, OnDestroy, output } from '@angular/core';
import { State } from '@ng-tool-collection/models';
import { catchError, of, Subscription, tap } from 'rxjs';
import { copyToClipboard } from '../utils/copy-to-clipboard.utils';

@Directive({
  selector: '[copyToClipboard]',
})
export class CopyToClipboardDirective<T> implements OnDestroy {
  copyToClipboard = input<T>();

  error = output<State.ERROR>();
  success = output<State.SUCCESS>();

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
        catchError(() => {
          this.error.emit(State.ERROR);
          return of(null);
        }),
      )
      .subscribe();
  }
}
