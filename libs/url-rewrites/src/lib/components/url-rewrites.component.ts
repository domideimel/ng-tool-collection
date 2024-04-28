import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-url-rewrites',
  templateUrl: './url-rewrites.component.html'
})
export class UrlRewritesComponent implements OnInit {
  formGroup!: FormGroup;

  constructor (private fb: FormBuilder) {}

  get urlRowsFormArray () {
    return this.formGroup.get('urlRows') as FormArray;
  }

  get hasOnlyOneRow (): boolean {
    return this.urlRowsFormArray.length === 1;
  }

  ngOnInit (): void {
    this.formGroup = this.fb.group({
      urlRows: this.fb.array([this.fb.group({
        oldUrl: ['', [Validators.min(1), Validators.required]],
        newUrl: ['', [Validators.min(1), Validators.required]]
      })])
    });
  }

  addUrlRow () {
    const urlRow = this.fb.group({
      oldUrl: ['', [Validators.min(1), Validators.required]],
      newUrl: ['', [Validators.min(1), Validators.required]]
    });
    this.urlRowsFormArray.push(urlRow);
  }

  removeUrlRow (index: number) {
    if (this.hasOnlyOneRow) {
      return;
    }
    this.urlRowsFormArray.removeAt(index);
  }

  onSubmit () {}
}
