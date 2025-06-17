import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CopyToClipboardDirective } from "./copy-to-clipboard.directive";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { By } from "@angular/platform-browser";
import { State } from "@ng-tool-collection/models";

@Component({
  template: `
    <button [copyToClipboard]="textToCopy()" (copied)="onCopied($event)" data-testid="copy-button">Copy Text</button>
  `,
  standalone: true,
  imports: [CopyToClipboardDirective],
})
class TestComponent {
  textToCopy = signal("Test text");
  copySuccess = false;
  copyState?: State;

  onCopied(state: State) {
    this.copySuccess = state === State.SUCCESS;
    this.copyState = state;
  }
}

describe("CopyToClipboardDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockClipboard: {
    writeText: vi.Mock;
  };

  beforeEach(async () => {
    mockClipboard = {
      writeText: vi.fn(),
    };

    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should copy text to clipboard on button click", async () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('[data-testid="copy-button"]'));
    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(mockClipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(component.copySuccess).toBe(true);
    expect(component.copyState).toBe(State.SUCCESS);
  });

  it("should handle clipboard API errors", async () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('[data-testid="copy-button"]'));
    mockClipboard.writeText.mockRejectedValueOnce(new Error("Clipboard error"));

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(mockClipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(component.copySuccess).toBe(false);
    expect(component.copyState).toBe(State.ERROR);
  });

  it("should handle missing clipboard API", async () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('[data-testid="copy-button"]'));
    Object.defineProperty(navigator, "clipboard", { value: undefined });

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(component.copySuccess).toBe(false);
    expect(component.copyState).toBe(State.ERROR);
  });

  it("should handle empty text", async () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('[data-testid="copy-button"]'));
    component.textToCopy.set("");
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    fixture.detectChanges();

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(mockClipboard.writeText).not.toHaveBeenCalled();
    expect(component.copySuccess).toBe(false);
    expect(component.copyState).toBe(undefined);
  });

  it("should handle null text", async () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('[data-testid="copy-button"]'));
    component.textToCopy.set(null as any);
    fixture.detectChanges();

    // Act
    button.nativeElement.click();
    await fixture.whenStable();

    // Assert
    expect(component.copySuccess).toBe(false);
    expect(component.copyState).toBe(undefined);
  });
});
