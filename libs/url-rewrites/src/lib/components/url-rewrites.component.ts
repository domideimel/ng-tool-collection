import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '@ng-tool-collection/ui';
import { UrlRewritesService } from '../services/url-rewrites.service';
import { Meta } from '@angular/platform-browser';
import { catchError, of, tap } from 'rxjs';
import { copyToClipboard } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { array, nonEmpty, object, pipe, required, string, url } from 'valibot';

const urlFormSchema = object({
  urlRows: array(
    required(
      object({
        oldUrl: pipe(string(), nonEmpty(), url()),
        newUrl: pipe(string(), nonEmpty(), url()),
      }),
      ['oldUrl', 'newUrl'],
    ),
  ),
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html',
  imports: [CardComponent, ReactiveFormsModule, Button, FormsModule, Textarea, InputText, FormField],
})
export class UrlRewritesComponent implements OnInit {
  result = signal<string>('');
  signalFormGroup = signal({
    urlRows: [this.createSignalFormGroup()],
  });
  signalForm = form(this.signalFormGroup, formSchema => {
    validateStandardSchema(formSchema, urlFormSchema);
  });
  hasOnlyOneSignalRow = computed(() => this.signalFormGroup().urlRows.length === 1);

  private rewriteService = inject(UrlRewritesService);
  private meta = inject(Meta);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content: 'Erstellen Sie benutzerdefinierte Weiterleitungen für Ihre URLs und Links - schnell und einfach!',
    });
  }

  addUrlRowSignal = () => {
    this.signalFormGroup.update(old => ({
      urlRows: [...old.urlRows, this.createSignalFormGroup()],
    }));
  };

  removeUrlRowSignal = (index: number) => {
    if (this.hasOnlyOneSignalRow()) return;
    this.signalFormGroup.update(old => ({
      urlRows: old.urlRows.filter((_, i) => i !== index),
    }));
  };

  onSubmit() {
    this.rewriteService
      .generateRewrites(this.signalForm().value())
      .pipe(tap(result => this.result.set(result)))
      .subscribe();
  }

  copyRewrites() {
    copyToClipboard(this.result())
      .pipe(
        tap(() => this.messageService.add({ severity: 'success', detail: `Die Rewrites wurden erfolgreich kopiert` })),
        catchError(err => {
          this.messageService.add({ severity: 'error', detail: `Es gab ein Fehler beim kopieren` });
          return of(err);
        }),
      )
      .subscribe();
  }

  private createSignalFormGroup() {
    return {
      oldUrl: '',
      newUrl: '',
    };
  }
}
