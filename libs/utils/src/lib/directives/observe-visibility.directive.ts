import { computed, Directive, effect, ElementRef, inject, input, OnDestroy, output } from '@angular/core';
import { delay, filter, Subject } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[observeVisibility]',
})
export class ObserveVisibilityDirective implements OnDestroy {
  debounceTime = input(0);
  threshold = input(0.1);

  visible = output<HTMLElement>();

  private subject$ = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  }>();
  observer = computed<IntersectionObserver>(() => {
    const options = {
      rootMargin: '0px',
      threshold: this.threshold(),
    };

    const isIntersecting = (entry: IntersectionObserverEntry) => {
      return entry.isIntersecting || entry.intersectionRatio > 0;
    };

    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (isIntersecting(entry)) {
          this.subject$.next({ entry, observer });
        }
      });
    }, options);
  });
  private element = inject(ElementRef);

  constructor() {
    effect(() => {
      this.observer().observe(this.element.nativeElement);

      this.subject$.pipe(delay(this.debounceTime()), filter(Boolean)).subscribe(async ({ entry }) => {
        const target = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          this.visible.emit(target);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.observer()) {
      this.observer().disconnect();
    }

    this.subject$.complete();
  }
}
