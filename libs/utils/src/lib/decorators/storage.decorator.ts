import { signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

type StorageType = 'localStorage' | 'sessionStorage';

function createStorageDecorator<T>(storageType: StorageType) {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;

  return (key?: string): PropertyDecorator => {
    return (target, propertyName) => {
      const storageKey = key || propertyName;
      let valueSignal: WritableSignal<T | undefined>;

      Object.defineProperty(target, propertyName, {
        get(): WritableSignal<T | undefined> {
          if (!valueSignal) {
            // Load the value from storage or initialize it
            const storedValue = storage.getItem(storageKey.toString());
            const initialValue = storedValue ? (JSON.parse(storedValue) as unknown as T) : undefined;

            // Create a WritableSignal for the property and sync with storage
            valueSignal = signal<T | undefined>(initialValue);
            const valueObservable = toObservable(valueSignal);
            valueObservable.subscribe(newValue => {
              if (newValue === undefined || newValue === null) {
                storage.removeItem(storageKey.toString());
              } else {
                storage.setItem(storageKey.toString(), JSON.stringify(newValue));
              }
            });
          }

          return valueSignal;
        },
        set(newValue: WritableSignal<T> | T) {
          if (!valueSignal) {
            // Trigger initialization if not already done
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this[propertyName];
          }

          if (valueSignal() && newValue instanceof Function) {
            throw new Error('Cannot override the WritableSignal itself. Set the value instead.');
          }
          valueSignal.set(newValue as T);
        },
      });
    };
  };
}

// Decorators for LocalStorage and SessionStorage
export const LocalStorage = <T>(key?: string) => createStorageDecorator<T>('localStorage')(key);
export const SessionStorage = <T>(key?: string) => createStorageDecorator<T>('sessionStorage')(key);
