import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { CardComponent } from '../../../../../ui/src/lib/components/card/card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-card-grid',
  templateUrl: './card-grid.component.html',
  standalone: true,
  imports: [CardComponent]
})
export class CardGridComponent implements OnInit {
  cards: Link[] = [];

  ngOnInit (): void {
    this.cards = NAVIGATION;
  }
}
