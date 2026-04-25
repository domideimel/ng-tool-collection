import { ErrorHandler, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  private router = inject(Router);

  handleError(error: unknown): void {
    const id = this.createErrorId();

    this.logger.error('Unhandled application error', {
      id,
      error: this.normalizeError(error),
    });

    // Navigate to a friendly error page; defer to avoid re-entrancy issues
    // Preserve current URL in state so the error page can offer a return action
    queueMicrotask(() => {
      // Avoid navigation loops if already on error page
      const url = this.router.url ?? '';
      if (!url.includes('/tools/error') && !url.endsWith('/error')) {
        this.router.navigate(['/tools/error'], { queryParams: { id }, state: { from: url } }).catch(() => {
          // In case navigation fails, silently ignore
        });
      }
    });

    // Rethrow in dev to surface in console/DevTools stack inspection
    // Note: Angular TestBed rethrows by default in tests.

    // Do not rethrow in production to reduce user impact.
  }

  private createErrorId(): string {
    // Simple, non-PII identifier
    return (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)).toUpperCase();
  }

  private normalizeError(error: unknown): { type: string; message: string; name?: string } {
    if (error instanceof Error) {
      return {
        type: 'Error',
        name: error.name,
        message: error.message,
      };
    }

    if (typeof error === 'string') {
      return {
        type: 'string',
        message: error,
      };
    }

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      return {
        type: 'object',
        message: error.message,
      };
    }

    return {
      type: typeof error,
      message: 'Unbekannter Fehler',
    };
  }
}
