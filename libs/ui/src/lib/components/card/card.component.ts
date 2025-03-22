import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgpButton } from 'ng-primitives/button';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgpButton],
})
export class CardComponent {
  title = input.required<string>();
  description = input<string>('');
  link = input<string>('');
  linkText = input<string>('Zum Tool');
  showLink = input<boolean>(true);
}
