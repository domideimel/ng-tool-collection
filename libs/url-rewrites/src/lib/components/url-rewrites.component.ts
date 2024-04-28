import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { urlValidator } from '@ng-tool-collection/ui';
import { UrlRewritesService } from '../services/url-rewrites.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html'
})
export class UrlRewritesComponent implements OnInit {
  formGroup!: FormGroup;
  result = signal<string>('');

  constructor (private fb: FormBuilder, private toast: HotToastService, private rewriteService: UrlRewritesService) {}

  get urlRowsFormArray () {
    return this.formGroup.get('urlRows') as FormArray;
  }

  get hasOnlyOneRow (): boolean {
    return this.urlRowsFormArray.length === 1;
  }

  ngOnInit (): void {
    this.formGroup = this.fb.group({
      urlRows: this.fb.array([this.fb.group({
        oldUrl: ['', [urlValidator, Validators.required]],
        newUrl: ['', [urlValidator, Validators.required]]
      })])
    });
  }

  addUrlRow () {
    const urlRow = this.fb.group({
      oldUrl: ['', [urlValidator, Validators.required]],
      newUrl: ['', [urlValidator, Validators.required]]
    });
    this.urlRowsFormArray.push(urlRow);
  }

  removeUrlRow (index: number) {
    if (this.hasOnlyOneRow) {
      return;
    }
    (this.formGroup.get('urlRows') as FormArray).removeAt(index);
  }

  onSubmit () {
    const result = this.rewriteService.generateRewrites(this.formGroup.value);
    this.result.set(result);
  }

  async copyRewrites () {
    try {
      await navigator.clipboard.writeText(this.result());
      this.toast.success('Die Rewrites wurden erfolgreich kopiert');
    } catch (e: unknown) {
      this.toast.success('Es gab ein Fehler beim kopieren');
    }
  }
}
