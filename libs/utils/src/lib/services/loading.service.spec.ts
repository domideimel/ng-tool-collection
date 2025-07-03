import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DownloadObservables, LoadingService } from './loading.service';
import { delayWhen, of, tap, throwError, timer } from 'rxjs';
import { State } from '@ng-tool-collection/models';

describe('DownloadServiceService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download and update state correctly', () => {
    return new Promise<void>(resolve => {
      const identifier = 'testIdentifier';
      const mockObservables: DownloadObservables<'testIdentifier', any> = {
        [identifier]: of(1).pipe(delayWhen(() => timer(2000))), // Simulate a 2 second download
      };
      const expectedStates = [
        { [identifier]: State.LOADING },
        { [identifier]: State.SUCCESS },
        { [identifier]: State.INIT }, // After the delay
      ];

      let stateCount = 0;

      service.load({ identifier, observables: mockObservables }).subscribe();
      service.getLoadingState('testIdentifier').subscribe(value => {
        expect(value).toEqual(expectedStates?.[stateCount]?.[identifier]);
        stateCount++;
        if (stateCount === expectedStates.length) {
          resolve();
        }
      });
    });
  });

  it('should handle download error and update state', () => {
    return new Promise<void>(resolve => {
      const identifier = 'testIdentifier';
      const errorMessage = 'Download failed';

      const mockObservables: DownloadObservables<'testIdentifier', any> = {
        [identifier]: throwError(() => errorMessage),
      };

      const expectedStates = [{ [identifier]: State.LOADING }, { [identifier]: State.ERROR }];

      let stateCount = 0;
      service.getLoadingState('testIdentifier').subscribe(value => {
        expect(value).toEqual(expectedStates?.[stateCount]?.[identifier]);
        stateCount++;
      });
      service.getErrorState('testIdentifier').subscribe(value => {
        expect(value).toEqual(errorMessage);
      });
      service.load({ identifier, observables: mockObservables }).subscribe({
        error: err => {
          expect(err).toEqual(errorMessage);
          resolve();
        },
      });
    });
  });

  it('should download and update state correctly for multiple identifier', () => {
    return new Promise<void>(resolve => {
      const identifier = 'testIdentifier';
      const identifier2 = 'testIdentifier2';

      const mockObservables: DownloadObservables<'testIdentifier' | 'testIdentifier2', any> = {
        testIdentifier: of('test'),
        testIdentifier2: of('test2'),
      };

      let completedCount = 0;
      const expectedCompletions = 2;

      // Subscribe to individual loading states to verify they update correctly
      service.getLoadingState('testIdentifier').subscribe(state => {
        if (state === State.SUCCESS) {
          completedCount++;
          if (completedCount === expectedCompletions) {
            resolve();
          }
        }
      });

      service.getLoadingState('testIdentifier2').subscribe(state => {
        if (state === State.SUCCESS) {
          completedCount++;
          if (completedCount === expectedCompletions) {
            resolve();
          }
        }
      });

      service
        .load({
          identifier: [identifier, identifier2],
          observables: mockObservables,
        })
        .subscribe({
          complete: () => {
            // Verify both identifiers were processed
            expect(completedCount).toBe(expectedCompletions);
          },
          error: err => {
            throw err;
          },
        });
    });
  });

  it('should execute observables with correct values for multiple identifiers', () => {
    return new Promise<void>(resolve => {
      const identifier = 'testIdentifier';
      const identifier2 = 'testIdentifier2';
      const expectedValue1 = 'test';
      const expectedValue2 = 'test2';

      const receivedValues: { [key: string]: any } = {};
      let completedCount = 0;
      const expectedCompletions = 2;

      // Create observables that capture their values when executed
      const mockObservables: DownloadObservables<'testIdentifier' | 'testIdentifier2', any> = {
        testIdentifier: of(expectedValue1).pipe(
          tap(value => {
            receivedValues[identifier] = value;
            completedCount++;
          }),
        ),
        testIdentifier2: of(expectedValue2).pipe(
          tap(value => {
            receivedValues[identifier2] = value;
            completedCount++;
          }),
        ),
      };

      service
        .load({
          identifier: [identifier, identifier2],
          observables: mockObservables,
        })
        .subscribe({
          complete: () => {
            // Verify that both observables were executed with correct values
            expect(receivedValues[identifier]).toBe(expectedValue1);
            expect(receivedValues[identifier2]).toBe(expectedValue2);
            expect(completedCount).toBe(expectedCompletions);
            resolve();
          },
          error: err => {
            throw err;
          },
        });
    });
  });

  it('should return correct values for multiple identifiers', () => {
    return new Promise<void>(resolve => {
      const identifier = 'testIdentifier';
      const identifier2 = 'testIdentifier2';
      const expectedValue1 = 'test';
      const expectedValue2 = 'test2';

      const mockObservables: DownloadObservables<'testIdentifier' | 'testIdentifier2', any> = {
        testIdentifier: of(expectedValue1),
        testIdentifier2: of(expectedValue2),
      };

      service
        .load({
          identifier: [identifier, identifier2],
          observables: mockObservables,
        })
        .subscribe({
          next: result => {
            // Now result should be properly typed as { testIdentifier: string, testIdentifier2: string }
            expect(result.testIdentifier).toBe(expectedValue1);
            expect(result.testIdentifier2).toBe(expectedValue2);
            expect(Object.keys(result)).toHaveLength(2);
            resolve();
          },
          error: err => {
            throw err;
          },
        });
    });
  });
});
