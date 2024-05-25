import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { passwordGeneratorRoutes } from './lib.routes'
import { GeneratorFormComponent } from './components/generator-form/generator-form.component'
import { UiModule } from '@ng-tool-collection/ui'
import { GeneratorPasswordOverviewComponent } from './components/generator-password-overview/generator-password-overview.component'
import { GeneratorWrapperComponent } from './components/generator-wrapper/generator-wrapper.component'

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(passwordGeneratorRoutes),
    GeneratorFormComponent, GeneratorPasswordOverviewComponent, GeneratorWrapperComponent
  ],
  exports: [GeneratorFormComponent, GeneratorPasswordOverviewComponent, GeneratorWrapperComponent]
})
export class PasswordGeneratorModule {}
