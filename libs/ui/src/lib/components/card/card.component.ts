import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lib-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, Button, NgClass],
})
export class CardComponent {
  cardTitle = input.required<string>({
    alias: 'title',
  });
  description = input<string>('');
  link = input<string>('');
  linkText = input<string>('Zum Tool');
  showLink = input<boolean>(true);
  fullHeight = input<boolean>(false);

  private router = inject(Router);

  onLinkClick() {
    this.router.navigate([this.link()]);
  }
}
