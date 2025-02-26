import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { GeneratorPasswordOverviewComponent } from '../generator-password-overview/generator-password-overview.component';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';
import { ReactiveStorageService } from '@ng-tool-collection/utils';

@Component({
  selector: 'lib-generator-wrapper',
  templateUrl: './generator-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GeneratorFormComponent, GeneratorPasswordOverviewComponent],
  providers: [ReactiveStorageService],
})
export class GeneratorWrapperComponent implements OnInit {
  private meta = inject(Meta);
  private storageService = inject(ReactiveStorageService);

  constructor() {
    this.storageService.configure('localStorage');
  }

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content: `Erstelle hier benutzerdefinierte Passwörter jeder beliebigen Länge - sicher und bequem!`,
    });
  }
}
