import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent, urlValidator } from '@ng-tool-collection/ui';
import { UrlRewritesService } from '../services/url-rewrites.service';
import { Meta } from '@angular/platform-browser';
import { catchError, of, tap } from 'rxjs';
import { copyToClipboard } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html',
  imports: [CardComponent, ReactiveFormsModule, Button, FormsModule, Textarea, InputText],
})
export class UrlRewritesComponent implements OnInit {
  result = signal<string>('');
  private fb = inject(FormBuilder);
  formGroup = this.fb.group({
    urlRows: this.fb.array([this.createUrlRow()]),
  });
  private rewriteService = inject(UrlRewritesService);
  private meta = inject(Meta);
  private messageService = inject(MessageService);

  get urlRowsFormArray() {
    return this.formGroup.get('urlRows') as FormArray;
  }

  get hasOnlyOneRow(): boolean {
    return this.urlRowsFormArray.length === 1;
  }

  ngOnInit() {
    this.meta.updateTag({
      name: 'description',
      content: 'Erstellen Sie benutzerdefinierte Weiterleitungen für Ihre URLs und Links - schnell und einfach!',
    });
  }

  addUrlRow() {
    this.urlRowsFormArray.push(this.createUrlRow());
  }

  removeUrlRow(index: number) {
    this.urlRowsFormArray.removeAt(index);
  }

  onSubmit() {
    this.rewriteService
      .generateRewrites((this.formGroup as FormGroup).value)
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

  private createUrlRow() {
    return this.fb.group({
      oldUrl: ['', [Validators.required, urlValidator]],
      newUrl: ['', [Validators.required, urlValidator]],
    });
  }
}
