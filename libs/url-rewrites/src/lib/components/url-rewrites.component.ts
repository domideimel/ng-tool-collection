import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html'
})
export class UrlRewritesComponent {}
