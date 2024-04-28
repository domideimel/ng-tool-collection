import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlRewritesService {
  generateRewrites = ({
    oldUrl,
    newUrl,
    is301 = true
  }: {
    oldUrl: string;
    newUrl: string;
    is301?: boolean;
  }): string => {
    try {
      const url = new URL(oldUrl);

      if (!url) {
        new Error('Invalid URL');
      }

      const statusCode = is301 ? 301 : 302;

      const path = this.preparePathForRegex(url.pathname);
      const query = this.preparePathForRegex(url.search);
      const host = this.preparePathForRegex(url.hostname);

      if (!query.length) {
        return `RewriteCond %{HTTP_HOST} ${host}$
RewriteCond %{REQUEST_URI} ^${path}$
RewriteRule .* RewriteRule .* ${newUrl} [NE,R=${statusCode},L]`;
      }

      return `RewriteCond %{HTTP_HOST} ${host}$
RewriteCond %{QUERY_STRING} ^${query}$
RewriteCond %{REQUEST_URI} ^${path}$
RewriteRule .* RewriteRule .* ${newUrl} [NE,R=${statusCode},L]`;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return error.message;
    }
  };

  preparePathForRegex = (path: string): string => {
    return path.replaceAll(/[\^$*+?{}\[\]\\|()\-\/_.]/g, '\\$&');
  };
}
