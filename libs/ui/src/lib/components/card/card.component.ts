import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, MatCardModule, MatAnchor],
})
export class CardComponent {
  title = input.required<string>();
  description = input('');
  link = input('');
  linkText = input('Zum Tool');
  showLink = input(true);
}
