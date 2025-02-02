import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-website',
  imports: [],
  templateUrl: './website.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsiteComponent {}
