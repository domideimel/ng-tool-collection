import { TestBed } from "@angular/core/testing";
import { ThemeService } from "./theme.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Setup mocks
const mockMatchMedia = vi.fn();
const mockSetAttribute = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(document, "body", {
  writable: true,
  value: { setAttribute: mockSetAttribute },
});

describe("ThemeService", () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    vi.clearAllMocks();

    // Default mock setup
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("should create service", () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it("should initialize with system dark mode preference", () => {
    mockMatchMedia.mockReturnValue({ matches: true });

    service = TestBed.inject(ThemeService);

    expect(mockMatchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("should initialize with system light mode preference", () => {
    mockMatchMedia.mockReturnValue({ matches: false });

    service = TestBed.inject(ThemeService);

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
  });

  it("should set dark theme", () => {
    service = TestBed.inject(ThemeService);
    vi.clearAllMocks();

    service.setDarkTheme(true);

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("should set light theme", () => {
    service = TestBed.inject(ThemeService);
    vi.clearAllMocks();

    service.setDarkTheme(false);

    expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
  });

  it("should emit theme changes via observable", async () => {
    service = TestBed.inject(ThemeService);

    const themeValues: boolean[] = [];
    service.isDarkTheme.subscribe(isDark => themeValues.push(isDark));

    service.setDarkTheme(true);
    service.setDarkTheme(false);

    expect(themeValues).toEqual([false, true, false]); // initial + 2 changes
  });

  it("should handle missing matchMedia gracefully", () => {
    Object.defineProperty(window, "matchMedia", {
      value: undefined,
      writable: true,
    });

    expect(() => TestBed.inject(ThemeService)).not.toThrow();
  });
});
