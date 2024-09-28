import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardComponent, ToastService } from '@ng-tool-collection/ui';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CardComponent],
})
export class GeneratorPasswordOverviewComponent {
  private storageService = inject(LocalStorageService);
  newPasswords = toSignal<string[]>(this.storageService.observe('passwords'));
  initialPasswords = signal<string[]>(this.storageService.retrieve('passwords'));
  passwords = computed<string[]>(() => {
    if (!this.newPasswords()) return this.initialPasswords() ?? [];
    return this.newPasswords() ?? [];
  });
  private toast = inject(ToastService);

  copy(password: string) {
    fromPromise(navigator.clipboard.writeText(password))
      .pipe(
        tap(() => this.toast.success('Passwort wurde erfolgreich kopiert')),
        catchError(err => {
          this.toast.error('Beim kopieren ist etwas schief gelaufen');
          return err;
        }),
      )
      .subscribe();
  }

  delete(password: string) {
    const currentPasswords = this.storageService.retrieve('passwords') as string[];
    this.storageService.store(
      'passwords',
      currentPasswords.filter(p => p !== password),
    );
    this.toast.success('Passwort wurde erfolgreich gelöscht');
  }
}
