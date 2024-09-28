import { Injectable } from '@angular/core';
import { catchError, from, mergeMap, Observable, reduce } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlRewritesService {
  generateRewrites(urlRows: { urlRows: { oldUrl: string; newUrl: string }[] }): Observable<string> {
    return from(urlRows.urlRows).pipe(
      mergeMap(urlRow => {
        const oldUrl = new URL(urlRow.oldUrl);

        const statusCode = 301; // Assuming 301 for now (can be configurable)

        const path = this.preparePathForRegex(oldUrl.pathname);
        const query = this.preparePathForRegex(oldUrl.search);
        const host = this.preparePathForRegex(oldUrl.hostname);

        return `
RewriteCond %{HTTP_HOST} ${host}$
${query.length ? `RewriteCond %{QUERY_STRING} ^${query}$` : ''}
RewriteCond %{REQUEST_URI} ^${path}$
RewriteRule .* ${urlRow.newUrl} [NE,R=${statusCode},L]
`;
      }),
      catchError(error => {
        console.error('Error generating rewrite for URL', error);
        return ''; // return empty string on error to be omitted in the final output
      }),
      reduce((acc, rewrite) => acc + rewrite, ''),
    );
  }

  preparePathForRegex = (path: string): string => {
    return path.replaceAll(/[\^$*+?{}\[\]\\|()\-\/_.]/g, '\\$&');
  };
}
