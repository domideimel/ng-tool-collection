import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { FormModel } from "@ng-tool-collection/models";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "lib-form",
  templateUrl: "./form.component.html",
})
export class FormComponent<T> implements OnInit {
  model = input.required<FormModel>();
  submitEvent = output<T>();
  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  hasErrors(controlName: string): ValidationErrors | undefined | null {
    return this.formGroup.get(controlName)?.errors;
  }

  ngOnInit() {
    this.formGroup = this.createForm();

    if (this.model()?.customValidators) {
      this.formGroup.setValidators(
        this.model().customValidators as ValidatorFn | ValidatorFn[]
      );
    }
  }

  onSubmit() {
    this.submitEvent.emit(this.formGroup?.value);
  }

  private createForm(): FormGroup {
    const group: any = {};

    this.model()?.items?.forEach((control) => {
      group[control.controlName] = [
        control.value || "",
        control.validators || [],
      ];
    });

    return this.fb.group(group);
  }
}
