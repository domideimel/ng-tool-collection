import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[clickOutside]',
  host: {
    '(document:click)': 'onClick($event.target)',
  },
})
export class ClickOutsideDirective {
  clickOutside = output();
  private elementRef = inject(ElementRef);

  public onClick(targetElement: HTMLElement): void {
    const isClickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.clickOutside.emit();
    }
  }
}
