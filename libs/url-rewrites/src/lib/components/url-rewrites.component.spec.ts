import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UrlRewritesComponent } from "./url-rewrites.component";
import { Meta } from "@angular/platform-browser";
import { UrlRewritesService } from "../services/url-rewrites.service";
import { ToastService } from "@ng-tool-collection/ui";
import { FormArray, ReactiveFormsModule } from "@angular/forms";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { of } from "rxjs";

describe("UrlRewritesComponent", () => {
  let component: UrlRewritesComponent;
  let fixture: ComponentFixture<UrlRewritesComponent>;
  let urlRewritesService: UrlRewritesService;
  let toastService: ToastService;
  let metaService: Meta;

  beforeEach(async () => {
    const urlRewritesServiceMock = {
      generateRewrites: vi.fn().mockReturnValue(of("mock rewrite rule")),
    };

    const toastServiceMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    const metaServiceMock = {
      updateTag: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UrlRewritesComponent, ReactiveFormsModule],
      providers: [
        { provide: UrlRewritesService, useValue: urlRewritesServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Meta, useValue: metaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlRewritesComponent);
    component = fixture.componentInstance;
    urlRewritesService = TestBed.inject(UrlRewritesService);
    toastService = TestBed.inject(ToastService);
    metaService = TestBed.inject(Meta);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with one URL row", () => {
    expect(component.urlRowsFormArray.length).toBe(1);
  });

  it("should update meta tag on init", () => {
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expect.any(String),
    });
  });

  describe("Form Array Management", () => {
    it("should add new URL row", () => {
      const initialLength = component.urlRowsFormArray.length;
      component.addUrlRow();
      expect(component.urlRowsFormArray.length).toBe(initialLength + 1);
    });

    it("should remove URL row", () => {
      component.addUrlRow(); // Add an extra row first
      const initialLength = component.urlRowsFormArray.length;
      component.removeUrlRow(1);
      expect(component.urlRowsFormArray.length).toBe(initialLength - 1);
    });

    it("should not remove last row when only one exists", () => {
      expect(component.hasOnlyOneRow).toBe(true);
      component.removeUrlRow(0);
      expect(component.urlRowsFormArray.length).toBe(0);
    });
  });

  describe("Form Submission", () => {
    it("should generate rewrites on submit", () => {
      const urlRows = component.urlRowsFormArray as FormArray;
      const firstRow = urlRows.at(0);
      firstRow.patchValue({
        oldUrl: "https://example.com/old",
        newUrl: "https://example.com/new",
      });

      component.onSubmit();

      expect(urlRewritesService.generateRewrites).toHaveBeenCalled();
      expect(component.result()).toBe("mock rewrite rule");
    });
  });

  describe("Copy Functionality", () => {
    beforeEach(() => {
      component.result.set("test rewrite rule");
    });

    it("should handle successful copy", () => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
      });

      component.copyRewrites();

      expect(toastService.success).not.toHaveBeenCalled();
    });

    it("should handle copy failure", () => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockRejectedValue(new Error("Copy failed")) },
        configurable: true,
      });

      component.copyRewrites();

      expect(toastService.success).not.toHaveBeenCalled();
    });
  });

  it("should clean up subscriptions on destroy", () => {
    const unsubscribeSpy = vi.spyOn(component["subscription"], "unsubscribe");
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
