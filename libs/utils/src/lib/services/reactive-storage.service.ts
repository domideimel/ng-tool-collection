import { computed, effect, Injectable, signal } from '@angular/core';

export type StorageType = 'localStorage' | 'sessionStorage';

@Injectable({
  providedIn: 'any',
})
export class ReactiveStorageService {
  // Use a safe storage by default to prevent runtime errors in non-browser/private mode
  private storage: Storage = this.getSafeStorage('localStorage');
  private suffix = ''; // Optional suffix for key names
  private data = signal<{ [key: string]: any }>({});
  private isConfigured = signal<boolean>(false); // Signal to indicate readiness

  constructor() {
    // Automatically persist changes to storage
    effect(() => {
      if (this.isConfigured()) {
        this._persistData();
      }
    });
  }

  /**
   * Configure the storage type (localStorage or sessionStorage) and optional key suffix
   * @param type StorageType
   * @param suffix Optional suffix added to all keys
   */
  configure(type: StorageType, suffix?: string) {
    // Select a safe storage backend based on the requested type
    this.storage = this.getSafeStorage(type);
    if (suffix && suffix.length > 0) {
      this.suffix = suffix; // Set suffix, default to empty if not provided
    }
    this._loadStoredData();

    // Mark the service as ready
    this.isConfigured.set(true);
  }

  /**
   * Retrieve a reactive signal for the value of a specific key
   * @param key The key to retrieve
   */
  getItem<T>(key: string) {
    // Block access until configured
    if (!this.isConfigured()) {
      throw new Error('ReactiveStorageService is not configured. Call configure() first.');
    }
    const suffixedKey = this._applySuffix(key);
    return computed(() => this.data()[suffixedKey] as T);
  }

  /**
   * Set a value for a specific key in storage
   * @param key The storage key
   * @param value The value to persist
   */
  setItem<T>(key: string, value: T) {
    if (!this.isConfigured()) {
      throw new Error('ReactiveStorageService is not configured. Call configure() first.');
    }
    const suffixedKey = this._applySuffix(key);
    const currentData = this.data();
    this.data.set({ ...currentData, [suffixedKey]: value });
  }

  /**
   * Remove a specific key from storage
   * @param key The storage key
   */
  removeItem(key: string) {
    if (!this.isConfigured()) {
      throw new Error('ReactiveStorageService is not configured. Call configure() first.');
    }
    const suffixedKey = this._applySuffix(key);
    const currentData = this.data();
    const { [suffixedKey]: _, ...rest } = currentData; // Omit the key
    this.data.set(rest);
  }

  /**
   * Clear all data in storage
   */
  clear() {
    if (!this.isConfigured()) {
      throw new Error('ReactiveStorageService is not configured. Call configure() first.');
    }
    this.data.set({});
  }

  /**
   * Returns a safe Storage implementation. If the requested Web Storage is not
   * available (SSR, private mode, or blocked), falls back to an in-memory implementation.
   */
  private getSafeStorage(type: StorageType): Storage {
    try {
      const candidate = type === 'localStorage' ? localStorage : sessionStorage;
      // Probe storage availability
      const testKey = `__probe_${Date.now()}__`;
      candidate.setItem(testKey, 'ok');
      candidate.removeItem(testKey);
      return candidate;
    } catch {
      // In-memory fallback implementing Storage interface
      const map = new Map<string, string>();
      const memoryStorage: Storage = {
        get length() {
          return map.size;
        },
        clear() {
          map.clear();
        },
        getItem(key: string) {
          return map.has(key) ? map.get(key)! : null;
        },
        key(index: number) {
          const keys = Array.from(map.keys());
          return index >= 0 && index < keys.length ? keys[index] : null;
        },
        removeItem(key: string) {
          map.delete(key);
        },
        setItem(key: string, value: string) {
          map.set(key, String(value));
        },
      } as Storage;
      return memoryStorage;
    }
  }

  /**
   * Private: Apply the configured suffix to the key
   * @param key The original key
   * @returns The suffixed key
   */
  private _applySuffix(key: string): string {
    return this.suffix ? `${key}_${this.suffix}` : key;
  }

  /**
   * Private: Load stored data into the signal
   */
  private _loadStoredData() {
    try {
      const keys = Object.keys(this.storage);
      const data: { [key: string]: any } = {};
      keys.forEach(key => {
        // Only load keys that match the configured suffix
        if (!this.suffix || key.endsWith(`_${this.suffix}`)) {
          const value = this.storage.getItem(key);
          try {
            const actualKey = this.suffix ? key.replace(`_${this.suffix}`, '') : key;
            data[actualKey] = value ? JSON.parse(value) : null;
          } catch (error) {
            console.error(`Failed to parse JSON for key "${key}":`, error);
            data[key] = null; // Default to null for invalid JSON
          }
        }
      });
      this.data.set(data);
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      this.data.set({}); // Default to an empty object if loading fails
    }
  }

  /**
   * Private: Persist the signal data into the storage backend
   */
  private _persistData() {
    try {
      const currentData = this.data();
      Object.keys(currentData).forEach(key => {
        const suffixedKey = this._applySuffix(key);
        try {
          this.storage.setItem(suffixedKey, JSON.stringify(currentData[key]));
        } catch (error) {
          console.error(`Failed to stringify data for key "${key}":`, error);
        }
      });

      // Clean up unused keys in storage
      const storedKeys = Object.keys(this.storage);
      storedKeys.forEach(key => {
        if (!Object.keys(this.data()).includes(key.replace(`_${this.suffix}`, ''))) {
          this.storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to persist data to storage:', error);
    }
  }
}
