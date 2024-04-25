import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './lib.routes';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { UiModule } from '@ng-tool-collection/ui';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(homeRoutes), UiModule],
  declarations: [CardGridComponent]
})
export class HomeModule {}
