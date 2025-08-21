import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'lib-offline-indicator',
  standalone: true,
  template: `
    @if (!isOnline()) {
      <div class="p-3 mb-4 rounded border border-yellow-300 bg-yellow-50 text-yellow-900">
        Du bist aktuell offline. Einige Tools funktionieren möglicherweise nur eingeschränkt. Änderungen werden ggf.
        lokal gespeichert und bei erneuter Verbindung synchronisiert.
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineIndicatorComponent implements OnInit, OnDestroy {
  private onlineSig = signal<boolean>(true);

  isOnline = computed(() => this.onlineSig());

  ngOnInit(): void {
    // initialize from current navigator state if available
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      this.onlineSig.set(navigator.onLine);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }
  }

  private onlineHandler = () => this.onlineSig.set(true);

  private offlineHandler = () => this.onlineSig.set(false);
}
