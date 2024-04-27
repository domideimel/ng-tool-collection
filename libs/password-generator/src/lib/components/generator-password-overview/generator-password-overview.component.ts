import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorPasswordOverviewComponent implements OnInit {
  passwords = signal<string[]>([]);

  constructor (private storageService: LocalStorageService) {}

  ngOnInit () {
    this.passwords.set(this.storageService.retrieve('passwords'));
    this.storageService.observe('passwords').subscribe(password => this.passwords.set(password));
  }
}
