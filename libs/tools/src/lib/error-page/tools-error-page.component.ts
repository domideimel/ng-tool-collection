import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-tools-error-page',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-2xl p-4 text-center">
      <h1 class="mb-2 text-2xl font-semibold">Es ist ein Fehler aufgetreten</h1>
      <p class="mb-4 text-gray-700">
        Leider ist etwas schiefgelaufen. Du kannst zur Startseite zurückkehren oder es erneut versuchen.
      </p>
      @if (errorId()) {
        <p class="mb-4 text-sm text-gray-500">Fehler-ID: {{ errorId() }}</p>
      }
      <div class="flex justify-center gap-2">
        <a routerLink="/tools" class="rounded bg-primary px-4 py-2 text-white">Zur Startseite</a>
        <button class="rounded border px-4 py-2" type="button" (click)="reload()">Erneut versuchen</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsErrorPageComponent {
  private readonly router = inject(Router);
  private readonly errorIdSignal = signal<string | null>(null);

  readonly errorId = computed(() => this.errorIdSignal());

  constructor() {
    const id = this.router.parseUrl(this.router.url).queryParams['id'] ?? null;
    this.errorIdSignal.set(id);
  }

  reload(): void {
    if (typeof location !== 'undefined') {
      location.reload();
    }
  }
}
