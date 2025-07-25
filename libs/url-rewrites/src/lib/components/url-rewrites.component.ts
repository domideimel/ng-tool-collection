import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent, urlValidator } from '@ng-tool-collection/ui';
import { UrlRewritesService } from '../services/url-rewrites.service';
import { Meta } from '@angular/platform-browser';
import { NgClass } from '@angular/common';
import { catchError, Subscription, tap } from 'rxjs';
import { copyToClipboard } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html',
  imports: [CardComponent, ReactiveFormsModule, NgClass],
})
export class UrlRewritesComponent implements OnInit, OnDestroy {
  result = signal<string>('');
  private fb = inject(FormBuilder);
  formGroup = this.fb.group({
    urlRows: this.fb.array([this.createUrlRow()]),
  });
  private rewriteService = inject(UrlRewritesService);
  private meta = inject(Meta);
  private messageService = inject(MessageService);

  private subscription = new Subscription();
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
    const submitSub = this.rewriteService
      .generateRewrites((this.formGroup as FormGroup).value)
      .subscribe(result => this.result.set(result));
    this.subscription.add(submitSub);
  }

  copyRewrites() {
    const copySub = copyToClipboard(this.result())
      .pipe(
        tap(() => this.messageService.add({ severity: 'success', detail: `Die Rewrites wurden erfolgreich kopiert` })),
        catchError(err => {
          this.messageService.add({ severity: 'error', detail: `Es gab ein Fehler beim kopieren` });
          return err;
        }),
      )
      .subscribe();

    this.subscription.add(copySub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private createUrlRow() {
    return this.fb.group({
      oldUrl: ['', [Validators.required, urlValidator]],
      newUrl: ['', [Validators.required, urlValidator]],
    });
  }
}
