import { Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = isDevMode() ? 'debug' : 'warn';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  debug(message?: any, ...optionalParams: any[]) {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', message, ...optionalParams);
      this.forward('debug', message, optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]) {
    if (this.shouldLog('info')) {
      console.info('[INFO]', message, ...optionalParams);
      this.forward('info', message, optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', message, ...optionalParams);
      this.forward('warn', message, optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', message, ...optionalParams);
      this.forward('error', message, optionalParams);
    }
  }

  private shouldLog(target: LogLevel): boolean {
    const order: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent'];
    return order.indexOf(target) >= order.indexOf(this.level) && this.level !== 'silent';
  }

  private forward(level: LogLevel, message: any, optionalParams: any[]) {
    // Only forward to Vercel logs in production builds and for warn/error (reduce noise)
    if (isDevMode()) return;
    if (level !== 'warn' && level !== 'error') return;
    if (typeof window === 'undefined') return;

    try {
      const url = '/api/log';
      const payload = this.buildPayload(level, message, optionalParams);
      const body = JSON.stringify(payload);

      // Prefer sendBeacon so logging doesn't block navigation/unload
      const nav = (typeof navigator !== 'undefined' ? navigator : undefined) as any;
      if (nav && typeof nav.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        nav.sendBeacon(url, blob);
        return;
      }

      // Fallback to fetch (fire-and-forget)
      void fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        /* ignore network errors */
      });
    } catch {
      // never throw from logger
    }
  }

  private buildPayload(level: LogLevel, message: any, optionalParams: any[]) {
    const safe = (val: any) => {
      if (val instanceof Error) {
        return {
          name: val.name,
          message: val.message,
          stack: val.stack,
        };
      }
      try {
        return typeof val === 'string' ? val : JSON.parse(JSON.stringify(val));
      } catch {
        return String(val);
      }
    };

    return {
      level,
      message: safe(message),
      meta: {
        params: optionalParams?.map(safe) ?? [],
        url: typeof location !== 'undefined' ? location.href : undefined,
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ts: Date.now(),
      },
    };
  }
}
