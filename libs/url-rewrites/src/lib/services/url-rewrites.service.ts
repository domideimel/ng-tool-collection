import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

type RewriteRow = {
  oldUrl: string;
  newUrl: string;
};

@Injectable({
  providedIn: 'root',
})
export class UrlRewritesService {
  generateRewrites(data: { urlRows: RewriteRow[] }): Observable<string> {
    const statusCode = 301; // Assuming 301 for now (can be configurable)

    const output = data.urlRows
      .flatMap(row => {
        const rewrite = this.buildRewrite(row, statusCode);
        return rewrite ? [rewrite] : [];
      })
      .join('\n\n');

    return of(output);
  }

  preparePathForRegex = (path: string): string => {
    return path.replaceAll(/[^\w~]|_/g, '\\$&');
  };

  private buildRewrite(row: RewriteRow, statusCode: number): string | null {
    if (this.containsControlCharacters(row.oldUrl) || this.containsControlCharacters(row.newUrl)) {
      return null;
    }

    try {
      const oldUrl = new URL(row.oldUrl);
      const newUrl = new URL(row.newUrl);

      if (!this.isHttpUrl(oldUrl) || !this.isHttpUrl(newUrl)) {
        return null;
      }

      const path = this.preparePathForRegex(oldUrl.pathname);
      const query = this.prepareQueryForRegex(oldUrl.search);
      const host = this.preparePathForRegex(oldUrl.hostname);

      return `
        RewriteCond %{HTTP_HOST} ${host}$
        ${query.length ? `RewriteCond %{QUERY_STRING} ^${query}$` : ''}
        RewriteCond %{REQUEST_URI} ^${path}$
        RewriteRule .* ${newUrl.toString()} [NE,R=${statusCode},L]`
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .join('\n');
    } catch {
      return null;
    }
  }

  private prepareQueryForRegex(queryString: string): string {
    const normalizedQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    return this.preparePathForRegex(normalizedQuery);
  }

  private containsControlCharacters(value: string): boolean {
    return /[\r\n\0]/.test(value);
  }

  private isHttpUrl(url: URL): boolean {
    return url.protocol === 'http:' || url.protocol === 'https:';
  }
}
