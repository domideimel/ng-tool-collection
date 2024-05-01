import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { Meta } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-card-grid',
  templateUrl: './card-grid.component.html',
})
export class CardGridComponent implements OnInit {
  cards = signal<Link[]>(NAVIGATION);

  constructor(private meta: Meta) {}

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content:
        'Entdecke unsere umfangreiche Sammlung an Tools, die entwickelt wurden, um deinen Alltag zu erleichtern. Von Produktivitätssteigerung bis hin zur Organisation – finde genau das, was du brauchst, um effizienter zu arbeiten und mehr zu erreichen.',
    });
  }
}
