import { TestBed } from '@angular/core/testing';
import { PasswordGeneratorService } from './password-generator.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { GenerationProperties } from '@ng-tool-collection/models';
import * as utils from '@ng-tool-collection/utils';

// Mock the utility functions
vi.mock('@ng-tool-collection/utils', () => ({
  sample: vi.fn(),
  random: vi.fn(),
  range: vi.fn(),
}));

describe('PasswordGeneratorService', () => {
  let service: PasswordGeneratorService;
  let mockSample: ReturnType<typeof vi.fn>;
  let mockRandom: ReturnType<typeof vi.fn>;
  let mockRange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Get mocked functions
    mockSample = vi.mocked(utils.sample);
    mockRandom = vi.mocked(utils.random);
    mockRange = vi.mocked(utils.range);

    // Setup default range mock behavior to match the actual range function
    mockRange.mockImplementation((start: number, end: number) => {
      return Array.from({ length: end - start }, (_, index) => start + index);
    });

    // Reset mocks
    vi.clearAllMocks();

    service = TestBed.inject(PasswordGeneratorService);
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('generatePassword', () => {
    it('should return empty string when no character types are selected', async () => {
      const props: GenerationProperties = {
        length: 10,
        lower: false,
        upper: false,
        number: false,
        symbol: false,
      };

      const result = await firstValueFrom(service.generatePassword(props));
      expect(result).toBe('');
    });

    it('should generate password with lowercase characters only', async () => {
      const props: GenerationProperties = {
        length: 5,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      // Mock sample to always return lowercase
      mockSample.mockReturnValue(['lower', true]);
      // Mock random for lowercase chars (97-122)
      mockRandom.mockReturnValue(97); // 'a'

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('aaaaa');
      expect(result).toHaveLength(5);
      expect(mockSample).toHaveBeenCalledTimes(5);
    });

    it('should generate password with uppercase characters only', async () => {
      const props: GenerationProperties = {
        length: 3,
        lower: false,
        upper: true,
        number: false,
        symbol: false,
      };

      mockSample.mockReturnValue(['upper', true]);
      mockRandom.mockReturnValue(65); // 'A'

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('AAA');
      expect(result).toHaveLength(3);
    });

    it('should generate password with numbers only', async () => {
      const props: GenerationProperties = {
        length: 4,
        lower: false,
        upper: false,
        number: true,
        symbol: false,
      };

      mockSample.mockReturnValue(['number', true]);
      mockRandom.mockReturnValue(48); // '0'

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('0000');
      expect(result).toHaveLength(4);
    });

    it('should generate password with symbols only', async () => {
      const props: GenerationProperties = {
        length: 2,
        lower: false,
        upper: false,
        number: false,
        symbol: true,
      };

      mockSample.mockReturnValue(['symbol', true]);
      // Mock random to return index 0 for symbol selection
      mockRandom.mockReturnValue(0);

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toHaveLength(2);
      expect(mockSample).toHaveBeenCalledTimes(2);
    });

    it('should generate mixed character password', async () => {
      const props: GenerationProperties = {
        length: 4,
        lower: true,
        upper: true,
        number: true,
        symbol: false,
      };

      // Mock different character types for each position
      mockSample
        .mockReturnValueOnce(['lower', true])
        .mockReturnValueOnce(['upper', true])
        .mockReturnValueOnce(['number', true])
        .mockReturnValueOnce(['lower', true]);

      mockRandom
        .mockReturnValueOnce(97) // 'a'
        .mockReturnValueOnce(65) // 'A'
        .mockReturnValueOnce(48) // '0'
        .mockReturnValueOnce(122); // 'z'

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('aA0z');
      expect(result).toHaveLength(4);
    });

    it('should handle zero length', async () => {
      const props: GenerationProperties = {
        length: 0,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('');
      expect(mockSample).not.toHaveBeenCalled();
    });

    it('should filter out false properties', async () => {
      const props: GenerationProperties = {
        length: 1,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      mockSample.mockReturnValue(['lower', true]);
      mockRandom.mockReturnValue(97);

      await firstValueFrom(service.generatePassword(props));

      // Should only pass properties that are true
      expect(mockSample).toHaveBeenCalledWith([['lower', true]]);
    });
  });

  describe('private methods', () => {
    describe('createSymbolString', () => {
      it('should create symbol string from ASCII ranges', () => {
        // The range function should work with the actual implementation
        const symbols = (service as any).createSymbolString();

        // Verify the range calls happened
        expect(mockRange).toHaveBeenCalledWith(33, 48);
        expect(mockRange).toHaveBeenCalledWith(58, 65);
        expect(mockRange).toHaveBeenCalledWith(91, 97);
        expect(mockRange).toHaveBeenCalledWith(123, 127);

        // Should have symbols from different ASCII ranges
        expect(symbols.length).toBeGreaterThan(0);
        expect(Array.isArray(symbols)).toBe(true);
      });
    });

    describe('getRandomChar', () => {
      it('should generate character within specified range', () => {
        mockRandom.mockReturnValue(65);

        const result = (service as any).getRandomChar(65, 90);

        expect(mockRandom).toHaveBeenCalledWith(65, 90);
        expect(result).toBe('A');
      });
    });

    describe('getRandomSymbol', () => {
      it('should return random symbol from provided array', () => {
        const symbols = ['!', '@', '#'];
        mockRandom.mockReturnValue(1);

        const result = (service as any).getRandomSymbol(symbols);

        expect(mockRandom).toHaveBeenCalledWith(0, 2);
        expect(result).toBe('@');
      });

      it('should use default symbols when none provided', () => {
        mockRandom.mockReturnValue(0);

        const result = (service as any).getRandomSymbol();

        // Should return the first symbol from the generated symbol array
        expect(typeof result).toBe('string');
        expect(result.length).toBe(1);
      });
    });

    describe('randomFunc', () => {
      it('should have all required character generation functions', () => {
        const randomFunc = (service as any).randomFunc;

        expect(randomFunc).toHaveProperty('lower');
        expect(randomFunc).toHaveProperty('upper');
        expect(randomFunc).toHaveProperty('number');
        expect(randomFunc).toHaveProperty('symbol');
        expect(typeof randomFunc.lower).toBe('function');
        expect(typeof randomFunc.upper).toBe('function');
        expect(typeof randomFunc.number).toBe('function');
        expect(typeof randomFunc.symbol).toBe('function');
      });

      it('should generate lowercase characters', () => {
        mockRandom.mockReturnValue(97);
        const result = (service as any).randomFunc.lower();
        expect(mockRandom).toHaveBeenCalledWith(97, 122);
        expect(result).toBe('a');
      });

      it('should generate uppercase characters', () => {
        mockRandom.mockReturnValue(90);
        const result = (service as any).randomFunc.upper();
        expect(mockRandom).toHaveBeenCalledWith(65, 90);
        expect(result).toBe('Z');
      });

      it('should generate number characters', () => {
        mockRandom.mockReturnValue(57);
        const result = (service as any).randomFunc.number();
        expect(mockRandom).toHaveBeenCalledWith(48, 57);
        expect(result).toBe('9');
      });

      it('should generate symbol characters', () => {
        mockRandom.mockReturnValue(0);
        const result = (service as any).randomFunc.symbol();
        expect(typeof result).toBe('string');
        expect(result.length).toBe(1);
      });
    });
  });

  describe('integration tests', () => {
    it('should generate password with realistic character distribution', async () => {
      const props: GenerationProperties = {
        length: 20,
        lower: true,
        upper: true,
        number: true,
        symbol: true,
      };

      // Mock realistic random behavior
      let callCount = 0;
      mockSample.mockImplementation(() => {
        const types = [
          ['lower', true],
          ['upper', true],
          ['number', true],
          ['symbol', true],
        ];
        return types[callCount++ % 4];
      });

      mockRandom.mockImplementation((min: number, max: number) => {
        if (min === 97 && max === 122) return 97; // 'a'
        if (min === 65 && max === 90) return 65; // 'A'
        if (min === 48 && max === 57) return 48; // '0'
        return 0; // symbol index
      });

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toHaveLength(20);
      expect(mockSample).toHaveBeenCalledTimes(20);
    });

    it('should handle large password lengths', async () => {
      const props: GenerationProperties = {
        length: 100,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      mockSample.mockReturnValue(['lower', true]);
      mockRandom.mockReturnValue(97);

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toHaveLength(100);
      expect(result).toBe('a'.repeat(100));
    });
  });

  describe('observable behavior', () => {
    it('should return an observable', () => {
      const props: GenerationProperties = {
        length: 5,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      const result = service.generatePassword(props);

      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should emit password value', done => {
      const props: GenerationProperties = {
        length: 3,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      mockSample.mockReturnValue(['lower', true]);
      mockRandom.mockReturnValue(97);

      service.generatePassword(props).subscribe(password => {
        expect(password).toBe('aaa');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle single character generation', async () => {
      const props: GenerationProperties = {
        length: 1,
        lower: true,
        upper: false,
        number: false,
        symbol: false,
      };

      mockSample.mockReturnValue(['lower', true]);
      mockRandom.mockReturnValue(122); // 'z'

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toBe('z');
      expect(result).toHaveLength(1);
    });

    it('should handle all character types enabled', async () => {
      const props: GenerationProperties = {
        length: 4,
        lower: true,
        upper: true,
        number: true,
        symbol: true,
      };

      mockSample
        .mockReturnValueOnce(['lower', true])
        .mockReturnValueOnce(['upper', true])
        .mockReturnValueOnce(['number', true])
        .mockReturnValueOnce(['symbol', true]);

      mockRandom
        .mockReturnValueOnce(97) // 'a'
        .mockReturnValueOnce(90) // 'Z'
        .mockReturnValueOnce(57) // '9'
        .mockReturnValueOnce(0); // first symbol

      const result = await firstValueFrom(service.generatePassword(props));

      expect(result).toHaveLength(4);
      expect(mockSample).toHaveBeenCalledTimes(4);
    });
  });
});
