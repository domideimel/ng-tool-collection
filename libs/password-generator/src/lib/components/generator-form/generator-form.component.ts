import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from "@angular/core";
import { FormModel, GenerationProperties } from "@ng-tool-collection/models";
import { Validators } from "@angular/forms";
import { PasswordGeneratorService } from "../../services/password-generator.service";
import { atLeastOneCheckedValidator, CardComponent, FormComponent, ToastService } from "@ng-tool-collection/ui";
import { catchError, finalize, Subscription, tap } from "rxjs";
import { copyToClipboard, ReactiveStorageService } from "@ng-tool-collection/utils";
import { NgpButton } from "ng-primitives/button";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "lib-generator-form",
  templateUrl: "./generator-form.component.html",
  imports: [CardComponent, FormComponent, NgpButton],
})
export class GeneratorFormComponent implements OnDestroy {
  formModel = {
    items: [
      {
        label: "Passwort Länge",
        controlName: "length",
        type: "range",
        value: 10,
        validators: [Validators.required, Validators.min(6), Validators.max(100)],
      },
      {
        label: "Großbuchstaben verwenden",
        controlName: "upper",
        type: "checkbox",
        value: true,
      },
      {
        label: "Kleinbuchstaben verwenden",
        controlName: "lower",
        type: "checkbox",
        value: true,
      },
      {
        label: "Sonderzeichen verwenden",
        controlName: "symbol",
        type: "checkbox",
        value: true,
      },
      {
        label: "Zahlen verwenden",
        controlName: "number",
        type: "checkbox",
        value: true,
      },
    ],
    submitButtonLabel: "Passwort generieren",
    customValidators: atLeastOneCheckedValidator(["upper", "lower", "symbol", "number"]),
  } as const satisfies FormModel;
  password = signal<string>("");
  hasCopied = signal<boolean>(true);
  private subscription = new Subscription();
  private passwordGeneratorService = inject(PasswordGeneratorService);
  private storageService = inject(ReactiveStorageService);
  private toast = inject(ToastService);

  onSubmit(value: unknown) {
    const submitSub = this.passwordGeneratorService
      .generatePassword(value as unknown as GenerationProperties)
      .pipe(
        tap(password => this.password.set(password)),
        finalize(() => this.hasCopied.set(false)),
      )
      .subscribe();
    this.subscription.add(submitSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  copyToClipboard() {
    const copySub = copyToClipboard(this.password())
      .pipe(
        tap(() => {
          const passwords = this.storageService.getItem<string[]>("passwords");
          const oldPasswords = passwords() ? passwords() : [];
          this.storageService.setItem("passwords", [this.password(), ...oldPasswords]);
          this.hasCopied.set(true);
          this.toast.success("Passwort wurde erfolgreich kopiert");
        }),
        catchError(err => {
          this.toast.error("Beim kopieren ist etwas schief gelaufen");
          return err;
        }),
      )
      .subscribe();
    this.subscription.add(copySub);
  }
}
