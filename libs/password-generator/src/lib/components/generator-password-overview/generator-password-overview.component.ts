import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardComponent, ToastService } from '@ng-tool-collection/ui';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, tap } from 'rxjs';
import { $localize } from '@angular/localize/init';

@Component({
  selector: 'lib-generator-password-overview',
  templateUrl: './generator-password-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
})
export class GeneratorPasswordOverviewComponent {
  passwords = computed<string[]>(() => {
    if (!this.newPasswords()) return this.initialPasswords() ?? [];
    return this.newPasswords() ?? [];
  });
  private storageService = inject(LocalStorageService);
  newPasswords = toSignal<string[]>(this.storageService.observe('passwords'));
  initialPasswords = signal<string[]>(this.storageService.retrieve('passwords'));
  private toast = inject(ToastService);

  copy(password: string) {
    fromPromise(navigator.clipboard.writeText(password))
      .pipe(
        tap(() => this.toast.success($localize`Passwort wurde erfolgreich kopiert`)),
        catchError(err => {
          this.toast.error($localize`Beim kopieren ist etwas schief gelaufen`);
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
    this.toast.success($localize`Passwort wurde erfolgreich gelöscht`);
  }
}
