import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { urlRewritesRoutes } from './lib.routes';
import { UrlRewritesComponent } from './components/url-rewrites.component';
import { UiModule } from '@ng-tool-collection/ui';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(urlRewritesRoutes), UiModule, ReactiveFormsModule],
  declarations: [UrlRewritesComponent]
})
export class UrlRewritesModule {}
