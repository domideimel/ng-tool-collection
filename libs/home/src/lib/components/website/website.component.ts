import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-website',
  imports: [CommonModule],
  templateUrl: './website.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteComponent {}
