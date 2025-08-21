import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-error-page',
  template: `
    <section class="max-w-2xl mx-auto p-4 text-center">
      <h1 class="text-2xl font-semibold mb-2">Es ist ein Fehler aufgetreten</h1>
      <p class="text-gray-700 mb-4">
        Leider ist etwas schiefgelaufen. Du kannst zur Startseite zurückkehren oder es erneut versuchen.
      </p>
      @if (errorId()) {
        <p class="text-sm text-gray-500 mb-4">Fehler-ID: {{ errorId() }}</p>
      }
      <div class="flex gap-2 justify-center">
        <a routerLink="/tools" class="px-4 py-2 bg-primary text-white rounded">Zur Startseite</a>
        <button class="px-4 py-2 border rounded" (click)="reload()">Erneut versuchen</button>
      </div>
    </section>
  `,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
  private router = inject(Router);
  private idSig = signal<string | null>(null);

  errorId = computed(() => this.idSig());

  constructor() {
    const id = this.router.parseUrl(this.router.url).queryParams['id'] ?? null;
    this.idSig.set(id);
  }

  reload() {
    // try to reload the current page
    if (typeof location !== 'undefined') {
      location.reload();
    }
  }
}
