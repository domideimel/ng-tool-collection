import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { Link } from '@ng-tool-collection/models';
import { NAVIGATION } from '@ng-tool-collection/constants';
import { Meta } from '@angular/platform-browser';
import { CardComponent } from '@ng-tool-collection/ui';
import { LocalStorage, SessionStorage } from '@ng-tool-collection/utils';

interface UserData {
  name: string;
  age: number;
}

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
  @LocalStorage<UserData>('user_data_key')
  userData = {
    name: 'John',
    age: 30,
  } as unknown as WritableSignal<UserData>;
  private meta = inject(Meta);
  @SessionStorage('some_key')
  private test = 'Test' as unknown as WritableSignal<string>;

  constructor() {
    effect(() => {
      console.log(this.test());
    });
  }

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content:
        'Entdecke unsere umfangreiche Sammlung an Tools, die entwickelt wurden, um deinen Alltag zu erleichtern. Von Produktivitätssteigerung bis hin zur Organisation – finde genau das, was du brauchst, um effizienter zu arbeiten und mehr zu erreichen.',
    });
  }

  onAddCard() {
    this.test.set(Math.random().toString());
  }
}
