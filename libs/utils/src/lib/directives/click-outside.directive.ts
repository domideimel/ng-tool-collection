import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  host: {
    '(document:click)': 'onClick($event.target)',
  },
})
export class ClickOutsideDirective {
  clickOutside = output();
  private elementRef = inject(ElementRef);

  public onClick(targetElement: EventTarget | null): void {
    if (!targetElement) return;
    const isClickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.clickOutside.emit();
    }
  }
}
