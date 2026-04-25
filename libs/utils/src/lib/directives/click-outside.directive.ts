import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[libClickOutside]',
  host: {
    '(document:click)': 'onClick($event.target)',
  },
})
export class ClickOutsideDirective {
  libClickOutside = output<void>();
  private elementRef = inject(ElementRef);

  public onClick(targetElement: EventTarget | null): void {
    if (!targetElement) return;
    const isClickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.libClickOutside.emit();
    }
  }
}
