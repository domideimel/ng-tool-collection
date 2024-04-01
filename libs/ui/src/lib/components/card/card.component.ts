import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() link = '';
  @Input() linkText = 'Zum Tool';
  @Input() showLink = true;
}
