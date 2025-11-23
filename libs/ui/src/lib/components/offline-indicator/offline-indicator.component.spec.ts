import { TestBed } from '@angular/core/testing';
import { OfflineIndicatorComponent } from './offline-indicator.component';

describe('OfflineIndicatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineIndicatorComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OfflineIndicatorComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show banner when going offline', () => {
    const fixture = TestBed.createComponent(OfflineIndicatorComponent);
    fixture.detectChanges();

    // Initially likely online in jsdom – banner not visible
    expect(fixture.nativeElement.textContent).not.toContain('offline');

    // Simulate going offline
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('offline'));
    }
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.toLowerCase()).toContain('offline');
  });
});
