import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concat, filter, from, ignoreElements, interval, map, mergeAll, mergeMap, Observable, of, reduce, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { State } from '@ng-tool-collection/models';

const STATE_CHANGE_DELAY = 2000;

export type Identifier =
  | 'pdfInvoice'
  | 'timesheet'
  | 'timesheetPdf'
  | 'addressProducts'
  | 'timesheetJson'
  | (string & {});
export type DownloadObservables<I extends Identifier, T> = Record<I, Observable<T>>;

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingStateSubject = new BehaviorSubject<Record<string, State>>({});
  private readonly loadingState$ = this.loadingStateSubject.asObservable();

  private loadingErrorSubject = new Subject<Record<string, Error>>();
  private readonly loadingError$ = this.loadingErrorSubject.asObservable();

  load<I extends Identifier, ObservableMap extends DownloadObservables<I, any>>({
    identifier,
    observables,
    stateChangeDelay = STATE_CHANGE_DELAY,
    deleteLoadingState = true,
  }: {
    identifier: I | I[];
    observables: ObservableMap;
    stateChangeDelay?: number;
    deleteLoadingState?: boolean;
  }): Observable<{
    [K in keyof ObservableMap]: ObservableMap[K] extends Observable<infer T> ? T : never;
  }> {
    const identifiers = Array.isArray(identifier) ? identifier : [identifier];

    return concat(
      // Set loading state
      of(null).pipe(
        tap(() => {
          const currentState = this.loadingStateSubject.value;
          const newState = { ...currentState };
          identifiers.forEach(id => {
            newState[id] = State.LOADING;
          });
          this.loadingStateSubject.next(newState);
        }),
        ignoreElements(),
      ),
      // Execute observables and collect results
      from(identifiers).pipe(
        mergeMap(
          id =>
            observables?.[id]?.pipe(
              tap(() => {
                this.loadingStateSubject.next({
                  ...this.loadingStateSubject.value,
                  [id]: State.SUCCESS,
                });
              }),
              map(value => ({ [id]: value })),
              catchError(error => {
                this.handleError(id, error);
                return throwError(() => error);
              }),
            ) || of({}),
        ),
        // Collect all results into a single object
        reduce((acc, curr) => ({ ...acc, ...curr }), {} as any),
      ),
      // Clean up states after delay
      interval(stateChangeDelay).pipe(
        take(1),
        tap(() => {
          if (!deleteLoadingState) return;
          const currentState = this.loadingStateSubject.value;
          const newState = { ...currentState };
          identifiers.forEach(id => {
            newState[id] = State.INIT;
          });
          this.loadingStateSubject.next(newState);
        }),
        tap(() => {
          if (!deleteLoadingState) return;
          const value = { ...this.loadingStateSubject.value };
          identifiers.forEach(id => {
            delete value[id];
          });
          this.loadingStateSubject.next(value);
        }),
        ignoreElements(),
      ),
    ) as Observable<{
      [K in keyof ObservableMap]: ObservableMap[K] extends Observable<infer T> ? T : never;
    }>;
  }

  getLatestMergedLoadingStates(...keys: Identifier[]) {
    const observables = keys.map(key => this.getLoadingState(key));
    return from(observables).pipe(
      mergeAll(),
      filter(state => state !== undefined),
    );
  }

  getLoadingState(identifier: Identifier) {
    return this.loadingState$.pipe(switchMap(stateRecord => of(stateRecord?.[identifier])));
  }

  getErrorState(identifier: Identifier) {
    return this.loadingError$.pipe(switchMap(stateRecord => of(stateRecord?.[identifier])));
  }

  removeErrorState(identifier: Identifier, stateChangeDelay = STATE_CHANGE_DELAY) {
    return interval(stateChangeDelay).pipe(
      take(1),
      tap(() => {
        this.loadingStateSubject.next({
          ...this.loadingStateSubject.value,
          [identifier]: State.INIT,
        });
      }),
      tap(() => {
        const value = { ...this.loadingStateSubject.value };
        delete value[identifier];
        this.loadingStateSubject.next(value);
      }),
      ignoreElements(),
    );
  }

  private handleError(identifier: Identifier, error: Error) {
    this.loadingStateSubject.next({ ...this.loadingStateSubject.value, [identifier]: State.ERROR });
    this.loadingErrorSubject.next({ [identifier]: error });
  }
}
