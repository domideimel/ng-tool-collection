import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lib-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  @Input() model: FormModel = {} as FormModel;
  @Output() submitEvent = new EventEmitter();
  formGroup!: FormGroup;

  constructor (private fb: FormBuilder) {}

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
