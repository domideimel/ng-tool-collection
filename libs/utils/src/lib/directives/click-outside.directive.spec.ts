import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { beforeEach, describe, expect, it } from 'vitest';

@Component({
  template: `
    <div id="outside">
      <div id="container" (clickOutside)="onClickOutside()">
        <button id="inside">Inside Button</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ClickOutsideDirective],
})
class TestComponent {
  clickedOutside = false;

  onClickOutside() {
    this.clickedOutside = true;
  }
}

describe('ClickOutsideDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit when clicking inside the element', () => {
    const insideButton = fixture.nativeElement.querySelector('#inside');
    insideButton.click();

    expect(component.clickedOutside).toBe(false);
  });

  it('should not emit when clicking the container element', () => {
    const container = fixture.nativeElement.querySelector('#container');
    container.click();

    expect(component.clickedOutside).toBe(false);
  });

  it('should emit when clicking outside the element', () => {
    const outside = fixture.nativeElement.querySelector('#outside');
    outside.click();

    expect(component.clickedOutside).toBe(true);
  });

  it('should emit when clicking the document body', () => {
    document.body.click();

    expect(component.clickedOutside).toBe(true);
  });
});
