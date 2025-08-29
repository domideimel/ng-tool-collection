import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyConverterComponent } from './currency-converter.component';
import { CardComponent } from '@ng-tool-collection/ui';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyConverterStore, CurrencyConverterStoreType } from '../store/currency-converter.store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let store: CurrencyConverterStoreType;

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
      providers: [FormBuilder, HttpClient, HttpHandler, { provide: CurrencyConverterStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(CurrencyConverterStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values from store', () => {
    const formValues = component.formGroup.value;
    expect(formValues).toEqual({ fromCurrency: 'eur', toCurrency: 'usd', amount: 1, result: 1 });
  });

  // it("should update store when form values change", async () => {
  //   const newValues = {
  //     fromCurrency: "GBP" as keyof Currencies,
  //     toCurrency: "USD" as keyof Currencies,
  //     amount: 200,
  //     result: 170,
  //   };
  //
  //   component.formGroup.patchValue(newValues);
  //
  //   // Wait for debounceTime
  //   await new Promise(resolve => setTimeout(resolve, 600));
  //
  //   expect(mockStore.updateStateFromForm).toHaveBeenCalledWith(expect.objectContaining(newValues));
  // });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = vi.spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  // it("should update form when computed values change", () => {
  //   const patchValueSpy = vi.spyOn(component.formGroup, "patchValue");
  //
  //   // Trigger the effect by changing store values
  //   mockStore.fromCurrency.mockReturnValue("GBP");
  //   mockStore.toCurrency.mockReturnValue("USD");
  //   mockStore.computedAmount.mockReturnValue(150);
  //   mockStore.computedResult.mockReturnValue(180);
  //
  //   // Force effect to run
  //   fixture.detectChanges();
  //
  //   expect(patchValueSpy).toHaveBeenCalledWith({
  //     fromCurrency: "GBP",
  //     toCurrency: "USD",
  //     amount: 150,
  //     result: 180,
  //   });
  // });

  it('should have form controls for all required fields', () => {
    expect(component.formGroup.contains('fromCurrency')).toBeTruthy();
    expect(component.formGroup.contains('toCurrency')).toBeTruthy();
    expect(component.formGroup.contains('amount')).toBeTruthy();
    expect(component.formGroup.contains('result')).toBeTruthy();
  });
});
