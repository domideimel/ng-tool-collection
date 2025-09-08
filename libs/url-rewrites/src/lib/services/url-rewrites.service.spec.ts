import { TestBed } from '@angular/core/testing';
import { UrlRewritesService } from './url-rewrites.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('UrlRewritesService', () => {
  let service: UrlRewritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlRewritesService],
    });
    service = TestBed.inject(UrlRewritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('preparePathForRegex', () => {
    it('should escape special characters', () => {
      const input = '/path/with-special^$*+?{}[]\\|()characters/.html';
      const result = service.preparePathForRegex(input);
      expect(result).toBe('\\/path\\/with\\-special\\^\\$\\*\\+\\?\\{\\}\\[\\]\\\\\\|\\(\\)characters\\/\\.html');
    });

    it('should handle empty string', () => {
      expect(service.preparePathForRegex('')).toBe('');
    });

    it('should handle path with query parameters', () => {
      const input = '/search?q=test&page=1';
      const result = service.preparePathForRegex(input);
      expect(result).toBe('\\/search\\?q=test&page=1');
    });
  });

  describe('generateRewrites', () => {
    it('should generate correct rewrite rules for single URL', async () => {
      const input = {
        urlRows: [
          {
            oldUrl: 'https://example.com/old-path',
            newUrl: 'https://example.com/new-path',
          },
        ],
      };

      const result = await firstValueFrom(service.generateRewrites(input));

      expect(result).toContain('RewriteCond %{HTTP_HOST} example\\.com$');
      expect(result).toContain('RewriteCond %{REQUEST_URI} ^\\/old\\-path$');
      expect(result).toContain('RewriteRule .* https://example.com/new-path [NE,R=301,L]');
    });

    it('should generate rules for multiple URLs', async () => {
      const input = {
        urlRows: [
          {
            oldUrl: 'https://example.com/path1',
            newUrl: 'https://example.com/new1',
          },
          {
            oldUrl: 'https://example.com/path2',
            newUrl: 'https://example.com/new2',
          },
        ],
      };

      const result = await firstValueFrom(service.generateRewrites(input));

      expect(result).toContain('/path1');
      expect(result).toContain('/new1');
      expect(result).toContain('/path2');
      expect(result).toContain('/new2');
    });

    it('should handle URLs with query parameters', async () => {
      const input = {
        urlRows: [
          {
            oldUrl: 'https://example.com/search?q=test&page=1',
            newUrl: 'https://example.com/new-search',
          },
        ],
      };

      const result = await firstValueFrom(service.generateRewrites(input));

      expect(result).toContain('RewriteCond %{QUERY_STRING} ^\\?q=test&page=1$');
    });

    it('should handle invalid URLs gracefully', async () => {
      const input = {
        urlRows: [
          {
            oldUrl: 'invalid-url',
            newUrl: 'https://example.com/new-path',
          },
        ],
      };

      const result = await firstValueFrom(service.generateRewrites(input));
      expect(result).toBe('');
    });

    it('should handle empty input', async () => {
      const input = {
        urlRows: [],
      };

      const result = await firstValueFrom(service.generateRewrites(input));
      expect(result).toBe('');
    });
  });
});
