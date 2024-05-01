import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlRewritesService {
  generateRewrites(urlRows: { urlRows: { oldUrl: string; newUrl: string }[] }): string {
    let rewrites = '';
    for (const urlRow of urlRows.urlRows) {
      try {
        const oldUrl = new URL(urlRow.oldUrl);

        const statusCode = 301; // Assuming 301 for now (can be configurable)

        const path = this.preparePathForRegex(oldUrl.pathname);
        const query = this.preparePathForRegex(oldUrl.search);
        const host = this.preparePathForRegex(oldUrl.hostname);

        const rewrite = `
RewriteCond %{HTTP_HOST} ${host}$
${query.length ? `RewriteCond %{QUERY_STRING} ^${query}$` : ''}
RewriteCond %{REQUEST_URI} ^${path}$
RewriteRule .* ${urlRow.newUrl} [NE,R=${statusCode},L]
`;

        rewrites += rewrite;
      } catch (error: unknown) {
        console.error('Error generating rewrite for URL row:', urlRow, error);
      }
    }
    return rewrites;
  }

  preparePathForRegex = (path: string): string => {
    return path.replaceAll(/[\^$*+?{}\[\]\\|()\-\/_.]/g, '\\$&');
  };
}
