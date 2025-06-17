import { catchError, map, Observable, of, switchMap, throwError } from "rxjs";
import { State } from "@ng-tool-collection/models";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

export const copyToClipboard = <T>(data: T) => {
  if (!navigator?.clipboard || !navigator?.clipboard?.writeText || !data) {
    return throwError(() => State.ERROR) as Observable<State>;
  }

  const dataToCopy$ = of(data).pipe(map(data => (typeof data === "string" ? data : JSON.stringify(data))));

  return dataToCopy$.pipe(
    switchMap(dataToCopy => fromPromise(navigator.clipboard.writeText(dataToCopy))),
    catchError(err => {
      console.error(err);
      return throwError(() => State.ERROR) as Observable<State>;
    }),
    map(() => State.SUCCESS),
  );
};
