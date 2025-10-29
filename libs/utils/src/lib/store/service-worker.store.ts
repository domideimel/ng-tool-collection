import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { filter, tap } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ServiceWorkerState = {
  hasUpdates: boolean;
};

export const ServiceWorkerStore = signalStore(
  {
    providedIn: 'root',
  },
  withState<ServiceWorkerState>({
    hasUpdates: false,
  }),
  withMethods(store => {
    const updateHasUpdates = (hasUpdates: boolean) => {
      patchState(store, state => ({ ...state, hasUpdates }));
    };

    const update = () => {
      document.location.reload();
    };

    return { updateHasUpdates, update };
  }),
  withHooks(store => {
    const swUpdate = inject(SwUpdate);
    const destroyRef = inject(DestroyRef);
    return {
      onInit() {
        swUpdate.versionUpdates
          .pipe(
            takeUntilDestroyed(destroyRef),
            filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
            tap(() => {
              store.updateHasUpdates(true);
            }),
          )
          .subscribe();
      },
    };
  }),
);
