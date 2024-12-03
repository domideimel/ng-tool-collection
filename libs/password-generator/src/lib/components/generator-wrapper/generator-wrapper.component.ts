import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { GeneratorPasswordOverviewComponent } from '../generator-password-overview/generator-password-overview.component';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';
import { $localize } from '@angular/localize/init';

@Component({
  selector: 'lib-generator-wrapper',
  templateUrl: './generator-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GeneratorFormComponent, GeneratorPasswordOverviewComponent],
})
export class GeneratorWrapperComponent implements OnInit {
  private meta = inject(Meta);

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content: $localize`Erstelle hier benutzerdefinierte Passwörter jeder beliebigen Länge - sicher und bequem!`,
    });
  }
}
