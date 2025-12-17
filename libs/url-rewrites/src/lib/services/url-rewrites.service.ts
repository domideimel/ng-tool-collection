import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlRewritesService {
  generateRewrites(data: { urlRows: { oldUrl: string; newUrl: string }[] }): Observable<string> {
    let output = '';
    const statusCode = 301; // Assuming 301 for now (can be configurable)

    for (const row of data.urlRows) {
      try {
        const oldUrl = new URL(row.oldUrl);
        const path = this.preparePathForRegex(oldUrl.pathname);
        const query = this.preparePathForRegex(oldUrl.search);
        const host = this.preparePathForRegex(oldUrl.hostname);

        output += `
RewriteCond %{HTTP_HOST} ${host}$
${query.length ? `RewriteCond %{QUERY_STRING} ^${query}$` : ''}
RewriteCond %{REQUEST_URI} ^${path}$
RewriteRule .* ${row.newUrl} [NE,R=${statusCode},L]
`;
      } catch (error) {
        console.error('Error generating rewrite for URL', error);
      }
    }
    return of(output);
  }

  preparePathForRegex = (path: string): string => {
    return path.replaceAll(/[\^$*+?{}[\]\\|()\-/_.]/g, '\\$&');
  };
}
