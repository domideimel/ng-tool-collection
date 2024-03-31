import { Component, OnInit } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';

@Component({
  selector: 'lib-card-grid',
  templateUrl: './card-grid.component.html'
})
export class CardGridComponent implements OnInit {
  cards: Link[] = [];

  ngOnInit (): void {
    this.cards = NAVIGATION;
  }
}
