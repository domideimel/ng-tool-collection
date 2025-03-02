import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { filter, Subscription, tap } from 'rxjs';
import { inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

type ServiceWorkerState = {
  hasUpdates: boolean;
};

const subs = new Subscription();

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

    const destroy = () => {
      subs.unsubscribe();
    };
    return { updateHasUpdates, update, destroy };
  }),
  withHooks(store => {
    const swUpdate = inject(SwUpdate);
    return {
      onInit() {
        const sub = swUpdate.versionUpdates
          .pipe(
            tap(evt => {
              console.log(evt);
            }),
            filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
            tap(() => {
              store.updateHasUpdates(true);
            }),
          )
          .subscribe();

        subs.add(sub);
      },
      onDestroy() {
        store.destroy();
      },
    };
  }),
);
