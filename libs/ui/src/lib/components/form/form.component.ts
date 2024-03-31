import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormModel } from '@ng-tool-collection/models';

@Component({
  selector: 'lib-form',
  templateUrl: './form.component.html'
})
export class FormComponent {
  @Input() model: FormModel = {} as FormModel;
  @Output() submitEvent = new EventEmitter();

  @ViewChild('form') form: NgForm = {} as NgForm;

  onSubmit () {
    this.submitEvent.emit(this.form.value);
  }
}
