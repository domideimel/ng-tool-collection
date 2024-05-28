import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { BaseState, MessageContentItem } from '@ng-tool-collection/models';

export const BuilderStore = signalStore(
  withState<BaseState>({
    contentItems: []
  }),
  withMethods((store) => ({
    updateContentItems (item: MessageContentItem) {
      patchState(store, state => ({ ...state, contentItems: [...state.contentItems, item] }));
    }
  }))
);
