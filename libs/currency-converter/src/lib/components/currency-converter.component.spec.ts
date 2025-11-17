import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyConverterComponent } from './currency-converter.component';
import { CardComponent } from '@ng-tool-collection/ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyConverterStore } from '../store/currency-converter.store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Currencies } from '@ng-tool-collection/models';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;

  const mockStore = {
    currencies: vi.fn(() => ['USD', 'EUR', 'GBP']),
    fromCurrency: vi.fn(() => 'USD'),
    toCurrency: vi.fn(() => 'EUR'),
    computedAmount: vi.fn(() => 100),
    computedResult: vi.fn(() => 85),
    updateStateFromForm: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CardComponent, CurrencyConverterComponent],
      providers: [FormBuilder, provideHttpClientTesting()],
    })
      .overrideComponent(CurrencyConverterComponent, {
        set: {
          providers: [{ provide: CurrencyConverterStore, useValue: mockStore }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values from store', () => {
    const formValues = component.formGroup.value;
    expect(formValues).toEqual({ fromCurrency: 'USD', toCurrency: 'EUR', amount: 100, result: 85 });
  });

  it('should update store when form values change', async () => {
    vi.useFakeTimers();
    const newValues = {
      fromCurrency: 'GBP' as keyof Currencies,
      toCurrency: 'USD' as keyof Currencies,
      amount: 200,
      result: 170,
    };

    component.formGroup.patchValue(newValues);

    // Fast-forward debounceTime
    vi.advanceTimersByTime(600);

    expect(mockStore.updateStateFromForm).toHaveBeenCalledWith(expect.objectContaining(newValues));
    vi.useRealTimers();
  });

  it('should not emit form value changes when internal effect patches the form', () => {
    mockStore.updateStateFromForm.mockClear();

    // Simulate internal effect behavior by patching without emitting
    component.formGroup.patchValue(
      { fromCurrency: 'gbp', toCurrency: 'usd', amount: 150, result: 180 },
      { emitEvent: false },
    );

    expect(mockStore.updateStateFromForm).not.toHaveBeenCalled();
  });

  it('should have form controls for all required fields', () => {
    expect(component.formGroup.contains('fromCurrency')).toBeTruthy();
    expect(component.formGroup.contains('toCurrency')).toBeTruthy();
    expect(component.formGroup.contains('amount')).toBeTruthy();
    expect(component.formGroup.contains('result')).toBeTruthy();
  });
});
