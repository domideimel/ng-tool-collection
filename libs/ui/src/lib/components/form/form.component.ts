import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass]
})
export class FormComponent implements OnInit {
  @Input() model: FormModel = {} as FormModel;
  @Output() submitEvent = new EventEmitter();
  formGroup!: FormGroup;

  constructor (private fb: FormBuilder) {}

  hasErrors (controlName: string): ValidationErrors | undefined | null {
    return this.formGroup.get(controlName)?.errors;
  }

  ngOnInit () {
    this.formGroup = this.createForm();

    if (this.model.customValidators) {
      this.formGroup.setValidators(this.model.customValidators);
    }
  }

  onSubmit () {
    this.submitEvent.emit(this.formGroup?.value);
  }

  private createForm (): FormGroup {
    const group: any = {};

    this.model.items.forEach(control => {
      group[control.controlName] = [control.value || '', control.validators || []];
    });

    return this.fb.group(group);
  }
}
