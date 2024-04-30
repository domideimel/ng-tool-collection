import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-card-grid',
  templateUrl: './card-grid.component.html'
})
export class CardGridComponent {
  cards = signal<Link[]>(NAVIGATION);
}
