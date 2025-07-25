import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button],
})
export class CardComponent {
  cardTitle = input.required<string>({
    alias: 'title',
  });
  description = input<string>('');
  link = input<string>('');
  linkText = input<string>('Zum Tool');
  showLink = input<boolean>(true);

  private router = inject(Router);

  onLinkClick() {
    this.router.navigate([this.link()]);
  }
}
