import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PasswordGeneratorModule } from '@ng-tool-collection/password-generator';
import { UrlRewritesModule } from '@ng-tool-collection/url-rewrites';

@Component({
  standalone: true,
  imports: [RouterModule, PasswordGeneratorModule, UrlRewritesModule],
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
}
