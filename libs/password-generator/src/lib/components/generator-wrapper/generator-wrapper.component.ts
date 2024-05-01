import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'lib-generator-wrapper',
  templateUrl: './generator-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorWrapperComponent implements OnInit {
  constructor (private meta: Meta) {}

  ngOnInit () {
    this.meta.updateTag({
      name: 'description',
      content: 'Erstelle hier benutzerdefinierte Passwörter jeder beliebigen Länge - sicher und bequem!'
    });
  }
}
