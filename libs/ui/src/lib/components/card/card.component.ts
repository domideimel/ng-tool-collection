import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  title = input.required<string>();
  description = input('');
  link = input('');
  linkText = input('Zum Tool');
  showLink = input(true);
}
