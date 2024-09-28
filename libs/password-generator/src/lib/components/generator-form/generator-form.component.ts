import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormModel, GenerationProperties } from '@ng-tool-collection/models';
import { Validators } from '@angular/forms';
import { PasswordGeneratorService } from '../../services/password-generator.service';
import { atLeastOneCheckedValidator, CardComponent, FormComponent, ToastService } from '@ng-tool-collection/ui';
import { LocalStorageService } from 'ngx-webstorage';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, tap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-generator-form',
  templateUrl: './generator-form.component.html',
  standalone: true,
  imports: [CardComponent, FormComponent],
})
export class GeneratorFormComponent {
  formModel: FormModel = {
    items: [
      {
        label: 'Passwort Länge',
        controlName: 'length',
        type: 'range',
        value: 10,
        validators: [Validators.required, Validators.min(6), Validators.max(100)],
      },
      {
        label: 'Großbuchstaben verwenden',
        controlName: 'upper',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Kleinbuchstaben verwenden',
        controlName: 'lower',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Sonderzeichen verwenden',
        controlName: 'symbol',
        type: 'checkbox',
        value: true,
      },
      {
        label: 'Zahlen verwenden',
        controlName: 'number',
        type: 'checkbox',
        value: true,
      },
    ],
    submitButtonLabel: 'Passwort generieren',
    customValidators: atLeastOneCheckedValidator(['upper', 'lower', 'symbol', 'number']),
  };

  password = signal<string>('');
  hasCopied = signal<boolean>(false);

  private passwordGeneratorService = inject(PasswordGeneratorService);
  private storageService = inject(LocalStorageService);
  private toast = inject(ToastService);

  onSubmit(value: GenerationProperties) {
    this.passwordGeneratorService.generatePassword(value).subscribe(password => {
      this.password.set(password);
    });
    this.hasCopied.set(false);
  }

  copyToClipboard() {
    fromPromise(navigator.clipboard.writeText(this.password()))
      .pipe(
        tap(() => {
          const oldPasswords = this.storageService.retrieve('passwords') ?? [];
          this.storageService.store('passwords', [this.password(), ...oldPasswords]);
          this.hasCopied.set(true);
          this.toast.success('Passwort wurde erfolgreich kopiert');
        }),
        catchError(err => {
          this.toast.error('Beim kopieren ist etwas schief gelaufen');
          return err;
        }),
      )
      .subscribe();
  }
}
