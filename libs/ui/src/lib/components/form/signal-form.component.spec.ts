import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalFormComponent } from './signal-form.component';
import { minLength, pipe, string } from 'valibot';

describe('SignalFormComponent', () => {
  let component: SignalFormComponent<any>;
  let fixture: ComponentFixture<SignalFormComponent<any>>;

  const mockFormModel = {
    items: [
      {
        controlName: 'name',
        label: 'Name',
        type: 'text',
        value: 'John Doe',
        validators: pipe(string(), minLength(3, 'Too short')),
      },
      {
        controlName: 'email',
        label: 'Email',
        type: 'text',
        value: '',
      },
    ],
    submitButtonLabel: 'Submit',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formModel', mockFormModel);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values', () => {
    expect(component.form().value()).toEqual({
      name: 'John Doe',
      email: '',
    });
  });

  it('should validate name field correctly', async () => {
    (component as any).signalForm.set({
      name: 'Jo',
      email: '',
    });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.form().errors()).toBeTruthy();
    expect(component.hasErrors('name')).toBe(true);
    expect(component.getErrorMessage('name')).toContain('Too short');
  });

  it('should emit submitEvent on onSubmit', async () => {
    let emitted: any;
    component.submitEvent.subscribe(v => (emitted = v));
    await component.onSubmit();
    expect(emitted).toEqual({
      name: 'John Doe',
      email: '',
    });
  });

  it('should reset form', async () => {
    (component as any).signalForm.set({
      name: 'Jane Doe',
      email: '',
    });
    component.reset();
    await fixture.whenStable();
    expect(component.form().value()?.['name']).toBe('John Doe');
  });

  it('should emit errorEvent when form becomes invalid', async () => {
    let error: any;
    component.errorEvent.subscribe(v => (error = v));

    (component as any).signalForm.set({
      name: 'Jo',
      email: '',
    });
    await fixture.whenStable();

    expect(error).toBeTruthy();
  });
});
