import { computed, effect, Injectable, signal } from '@angular/core';

export type StorageType = 'localStorage' | 'sessionStorage';

@Injectable({
  providedIn: 'root',
})
export class ReactiveStorageService {
  private storage: Storage;
  private data = signal<{ [key: string]: any }>({}); // Use signal for reactive values

  constructor() {
    // Default to localStorage
    this.storage = localStorage;

    // Load initial data from storage
    this.loadStoredData();

    // Automatically persist changes to storage
    effect(() => {
      this.persistData();
    });
  }

  /**
   * Configure the storage type (localStorage or sessionStorage)
   * @param type StorageType
   */
  configure(type: StorageType) {
    this.storage = type === 'localStorage' ? localStorage : sessionStorage;
    this.loadStoredData();
  }

  /**
   * Retrieve a reactive signal for the value of a specific key
   * @param key The key to retrieve
   */
  getItem<T>(key: string) {
    return computed(() => this.data()[key] as T);
  }

  /**
   * Set a value for a specific key in storage
   * @param key The storage key
   * @param value The value to persist
   */
  setItem<T>(key: string, value: T) {
    const currentData = this.data();
    this.data.set({ ...currentData, [key]: value });
  }

  /**
   * Remove a specific key from storage
   * @param key The storage key
   */
  removeItem(key: string) {
    const currentData = this.data();
    const { [key]: _, ...rest } = currentData; // Omit the key
    this.data.set(rest);
  }

  /**
   * Clear all data in storage
   */
  clear() {
    this.data.set({});
  }

  /**
   * Load stored data into the signal
   */
  private loadStoredData() {
    const keys = Object.keys(this.storage);
    const data: { [key: string]: any } = {};
    keys.forEach(key => {
      const value = this.storage.getItem(key);
      data[key] = value ? JSON.parse(value) : null;
    });
    this.data.set(data);
  }

  /**
   * Persist the signal data into the storage backend
   */
  private persistData() {
    const currentData = this.data();
    Object.keys(currentData).forEach(key => {
      this.storage.setItem(key, JSON.stringify(currentData[key]));
    });

    // Clean up unused keys in storage
    const storedKeys = Object.keys(this.storage);
    storedKeys.forEach(key => {
      if (!(key in currentData)) {
        this.storage.removeItem(key);
      }
    });
  }
}
