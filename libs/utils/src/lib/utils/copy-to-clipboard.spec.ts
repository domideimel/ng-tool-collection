import { beforeEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copy-to-clipboard.utils';
import { State } from '@ng-tool-collection/models';
import { firstValueFrom } from 'rxjs';

describe('copyToClipboard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  describe('when clipboard API is available', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        configurable: true,
      });
    });

    it('should copy string data successfully', async () => {
      const testData = 'test string';
      const result = await firstValueFrom(copyToClipboard(testData));

      expect(result).toBe(State.SUCCESS);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testData);
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    it('should stringify and copy object data successfully', async () => {
      const testData = { key: 'value' };
      const result = await firstValueFrom(copyToClipboard(testData));

      expect(result).toBe(State.SUCCESS);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(testData));
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    it('should handle clipboard write errors', async () => {
      const testData = 'test string';
      const error = new Error('Clipboard error');

      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(error);
      vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await firstValueFrom(copyToClipboard(testData));
      } catch (err) {
        expect(err).toBe(State.ERROR);
      }

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('when clipboard API is not available', () => {
    beforeEach(() => {
      // Mock missing clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });
    });

    it('should return error state when clipboard API is not available', async () => {
      try {
        await firstValueFrom(copyToClipboard('test'));
      } catch (err) {
        expect(err).toBe(State.ERROR);
      }
    });

    it('should return error state for null data', async () => {
      try {
        await firstValueFrom(copyToClipboard(null));
      } catch (err) {
        expect(err).toBe(State.ERROR);
      }
    });
  });
});
