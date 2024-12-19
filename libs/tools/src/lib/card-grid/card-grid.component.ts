import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { Meta } from '@angular/platform-browser';
import { CardComponent } from '@ng-tool-collection/ui';
import { $localize } from '@angular/localize/init';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-card-grid',
  templateUrl: './card-grid.component.html',
  imports: [CardComponent],
})
export class CardGridComponent implements OnInit {
  cards = computed<Link[]>(() => {
    const link = NAVIGATION.find(link => link.path.includes('tools'));
    if (!link) return [];
    const children = link?.children?.map(child => ({
      ...child,
      path: child.path.replace('tools/', ''),
    }));
    return children ?? [];
  });
  private meta = inject(Meta);

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content: $localize`Entdecke unsere umfangreiche Sammlung an Tools, die entwickelt wurden, um deinen Alltag zu erleichtern. Von Produktivitätssteigerung bis hin zur Organisation – finde genau das, was du brauchst, um effizienter zu arbeiten und mehr zu erreichen.`,
    });
  }
}
