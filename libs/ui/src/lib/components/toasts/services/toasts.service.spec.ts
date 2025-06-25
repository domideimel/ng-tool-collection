import { TestBed } from "@angular/core/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastService } from "./toasts.service";

describe("ToastService", () => {
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ToastService],
    }).compileComponents();

    service = TestBed.inject(ToastService);

    // Mock crypto.randomUUID
    Object.defineProperty(global, "crypto", {
      value: {
        randomUUID: vi.fn(() => "test-uuid-123"),
      },
      writable: true,
    });

    // Mock setTimeout and use fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize with empty toasts array", () => {
    expect(service.toasts()).toEqual([]);
  });

  describe("success", () => {
    it("should add a success toast message", () => {
      const message = "Success message";

      service.success(message);

      const toasts = service.toasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0]).toEqual({
        id: "test-uuid-123",
        message,
        type: "success",
      });
    });
  });

  describe("error", () => {
    it("should add an error toast message", () => {
      const message = "Error message";

      service.error(message);

      const toasts = service.toasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0]).toEqual({
        id: "test-uuid-123",
        message,
        type: "error",
      });
    });
  });

  describe("info", () => {
    it("should add an info toast message", () => {
      const message = "Info message";

      service.info(message);

      const toasts = service.toasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0]).toEqual({
        id: "test-uuid-123",
        message,
        type: "info",
      });
    });
  });

  describe("warning", () => {
    it("should add a warning toast message", () => {
      const message = "Warning message";

      service.warning(message);

      const toasts = service.toasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0]).toEqual({
        id: "test-uuid-123",
        message,
        type: "warning",
      });
    });
  });

  describe("multiple toasts", () => {
    it("should add multiple toast messages", () => {
      const mockUUIDs = ["uuid-1", "uuid-2", "uuid-3"];
      let callCount = 0;

      const mockRandomUUID = vi.fn(() => mockUUIDs[callCount++]);
      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      service.success("First message");
      service.error("Second message");
      service.info("Third message");

      const toasts = service.toasts();
      expect(toasts).toHaveLength(3);
      expect(toasts[0]).toEqual({
        id: "uuid-1",
        message: "First message",
        type: "success",
      });
      expect(toasts[1]).toEqual({
        id: "uuid-2",
        message: "Second message",
        type: "error",
      });
      expect(toasts[2]).toEqual({
        id: "uuid-3",
        message: "Third message",
        type: "info",
      });
    });
  });

  describe("auto-removal", () => {
    it("should remove toast after 3 seconds", () => {
      service.success("Test message");

      expect(service.toasts()).toHaveLength(1);

      vi.advanceTimersByTime(3000);

      expect(service.toasts()).toHaveLength(0);
    });

    it("should remove correct toast when multiple exist", () => {
      const mockUUIDs = ["uuid-1", "uuid-2"];
      let callCount = 0;

      const mockRandomUUID = vi.fn(() => mockUUIDs[callCount++]);
      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      service.success("First message");
      vi.advanceTimersByTime(1000);
      service.error("Second message");

      expect(service.toasts()).toHaveLength(2);

      vi.advanceTimersByTime(2000);

      const remainingToasts = service.toasts();
      expect(remainingToasts).toHaveLength(1);
      expect(remainingToasts[0].id).toBe("uuid-2");
      expect(remainingToasts[0].message).toBe("Second message");
    });

    it("should remove all toasts after their respective timeouts", () => {
      const mockUUIDs = ["uuid-1", "uuid-2", "uuid-3"];
      let callCount = 0;

      const mockRandomUUID = vi.fn(() => mockUUIDs[callCount++]);
      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      service.success("First message");

      vi.advanceTimersByTime(1000);
      service.error("Second message");

      vi.advanceTimersByTime(1000);
      service.info("Third message");

      expect(service.toasts()).toHaveLength(3);

      vi.advanceTimersByTime(1000);
      expect(service.toasts()).toHaveLength(2);

      vi.advanceTimersByTime(1000);
      expect(service.toasts()).toHaveLength(1);
      expect(service.toasts()[0].message).toBe("Third message");

      vi.advanceTimersByTime(1000);
      expect(service.toasts()).toHaveLength(0);
    });
  });

  describe("toast signal properties", () => {
    it("should return readonly signal that cannot be modified externally", () => {
      const toastsSignal = service.toasts;

      expect(toastsSignal).not.toHaveProperty("set");
      expect(toastsSignal).not.toHaveProperty("update");
    });

    it("should maintain immutability when adding toasts", () => {
      service.success("First message");
      const firstSnapshot = service.toasts();

      service.error("Second message");
      const secondSnapshot = service.toasts();

      expect(firstSnapshot).toHaveLength(1);
      expect(secondSnapshot).toHaveLength(2);
      expect(firstSnapshot).not.toBe(secondSnapshot);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message strings", () => {
      service.success("");

      const toasts = service.toasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("");
    });

    it("should generate unique IDs for simultaneous toasts", () => {
      const mockUUIDs = ["uuid-1", "uuid-2", "uuid-3"];
      let callCount = 0;

      const mockRandomUUID = vi.fn(() => mockUUIDs[callCount++]);
      Object.defineProperty(global, "crypto", {
        value: { randomUUID: mockRandomUUID },
        writable: true,
      });

      service.success("Message 1");
      service.success("Message 2");
      service.success("Message 3");

      const toasts = service.toasts();
      const ids = toasts.map(toast => toast.id);

      expect(new Set(ids).size).toBe(3);
    });
  });
});
