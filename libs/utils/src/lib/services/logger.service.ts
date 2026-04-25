import { Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

type SanitizedLogValue =
  | string
  | number
  | boolean
  | null
  | SanitizedLogValue[]
  | { [key: string]: SanitizedLogValue | undefined };

type BeaconNavigator = Navigator & {
  sendBeacon?: (url: string, data?: BodyInit | null) => boolean;
};

const LOG_LEVEL_ORDER: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent'];
const REMOTE_LOG_LEVELS = new Set<LogLevel>(['warn', 'error']);
const REMOTE_LOGGING_META_NAME = 'ngtc-log-endpoint';
const REDACTED_VALUE = '[REDACTED]';
const MAX_STRING_LENGTH = 500;
const MAX_ARRAY_LENGTH = 20;
const MAX_OBJECT_ENTRIES = 20;
const MAX_DEPTH = 4;
const SENSITIVE_KEY_PATTERN = /token|secret|password|authorization|cookie|session|api[-_]?key/i;

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private level: LogLevel = isDevMode() ? 'debug' : 'warn';

  setLevel(level: LogLevel) {
    this.level = level;
  }

  debug(message?: unknown, ...optionalParams: unknown[]) {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', message, ...optionalParams);
      this.forward('debug', message, optionalParams);
    }
  }

  info(message?: unknown, ...optionalParams: unknown[]) {
    if (this.shouldLog('info')) {
      console.info('[INFO]', message, ...optionalParams);
      this.forward('info', message, optionalParams);
    }
  }

  warn(message?: unknown, ...optionalParams: unknown[]) {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', message, ...optionalParams);
      this.forward('warn', message, optionalParams);
    }
  }

  error(message?: unknown, ...optionalParams: unknown[]) {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', message, ...optionalParams);
      this.forward('error', message, optionalParams);
    }
  }

  private shouldLog(target: LogLevel): boolean {
    return LOG_LEVEL_ORDER.indexOf(target) >= LOG_LEVEL_ORDER.indexOf(this.level) && this.level !== 'silent';
  }

  private forward(level: LogLevel, message: unknown, optionalParams: unknown[]) {
    if (isDevMode()) return;
    if (!REMOTE_LOG_LEVELS.has(level)) return;
    if (typeof window === 'undefined') return;

    const url = this.getRemoteLogEndpoint();
    if (!url) return;

    try {
      const payload = this.buildPayload(level, message, optionalParams);
      const body = JSON.stringify(payload);

      const nav: BeaconNavigator | undefined = typeof navigator !== 'undefined' ? navigator : undefined;
      if (nav?.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        nav.sendBeacon(url, blob);
        return;
      }

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

  private getRemoteLogEndpoint(): string | null {
    if (typeof document === 'undefined' || typeof location === 'undefined') {
      return null;
    }

    const endpoint = document
      .querySelector(`meta[name="${REMOTE_LOGGING_META_NAME}"]`)
      ?.getAttribute('content')
      ?.trim();

    if (!endpoint) {
      return null;
    }

    try {
      const url = new URL(endpoint, location.origin);
      if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) {
        return null;
      }

      return `${url.pathname}${url.search}`;
    } catch {
      return null;
    }
  }

  private buildPayload(level: LogLevel, message: unknown, optionalParams: unknown[]) {
    return {
      level,
      message: this.sanitizeValue(message),
      meta: {
        params: optionalParams.map(param => this.sanitizeValue(param)),
        path: typeof location !== 'undefined' ? location.pathname : undefined,
        ts: Date.now(),
      },
    };
  }

  private sanitizeValue(value: unknown, depth = 0, seen = new WeakSet<object>()): SanitizedLogValue {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Error) {
      return {
        name: this.limitString(value.name),
        message: this.limitString(value.message),
      };
    }

    if (typeof value === 'string') {
      return this.limitString(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (typeof value === 'symbol' || typeof value === 'function') {
      return String(value);
    }

    if (depth >= MAX_DEPTH) {
      return '[MaxDepthExceeded]';
    }

    if (Array.isArray(value)) {
      return value.slice(0, MAX_ARRAY_LENGTH).map(item => this.sanitizeValue(item, depth + 1, seen));
    }

    if (typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular]';
      }

      seen.add(value);

      const entries = Object.entries(value).slice(0, MAX_OBJECT_ENTRIES);
      return Object.fromEntries(
        entries.map(([key, nestedValue]) => [
          key,
          SENSITIVE_KEY_PATTERN.test(key) ? REDACTED_VALUE : this.sanitizeValue(nestedValue, depth + 1, seen),
        ]),
      );
    }

    return String(value);
  }

  private limitString(value: string): string {
    return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}…` : value;
  }
}
