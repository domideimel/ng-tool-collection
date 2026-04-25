import { catchError, from, map, Observable, throwError } from 'rxjs';
import { State } from '@ng-tool-collection/models';

export const copyToClipboard = <T>(data: T) => {
  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard?.writeText ||
    data === null ||
    data === undefined ||
    data === ''
  ) {
    return throwError(() => State.ERROR) as Observable<State>;
  }

  let dataToCopy: string;

  try {
    dataToCopy = typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    return throwError(() => State.ERROR) as Observable<State>;
  }

  return from(navigator.clipboard.writeText(dataToCopy)).pipe(
    catchError(() => {
      return throwError(() => State.ERROR) as Observable<State>;
    }),
    map(() => State.SUCCESS),
  );
};
