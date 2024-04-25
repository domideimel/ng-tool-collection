import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink]
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() link = '';
  @Input() linkText = 'Zum Tool';
  @Input() showLink = true;
}
