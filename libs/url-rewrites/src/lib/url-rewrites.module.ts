import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { urlRewritesRoutes } from './lib.routes';
import { UrlRewritesComponent } from './components/url-rewrites.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(urlRewritesRoutes), UrlRewritesComponent]
})
export class UrlRewritesModule {}
