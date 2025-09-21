import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { PasswordGeneratorService } from './password-generator.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, finalize, pipe, switchMap, tap } from 'rxjs';
import { GenerationProperties } from '@ng-tool-collection/models';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { copyToClipboard } from '@ng-tool-collection/utils';
import { MessageService } from 'primeng/api';

const INITIAL_STATE = {
  currentPassword: '',
  hasCopied: true,
  passwords: [] as string[],
};

export const PasswordStore = signalStore(
  withState(INITIAL_STATE),
  withProps(() => ({
    passwordService: inject(PasswordGeneratorService),
    messageService: inject(MessageService),
  })),
  withStorageSync({
    key: 'passwords',
    select: ({ passwords }) => ({ passwords }),
  }),
  withMethods(store => {
    const generatePassword = rxMethod<GenerationProperties>(
      pipe(
        switchMap(value =>
          store.passwordService.generatePassword(value).pipe(finalize(() => patchState(store, { hasCopied: false }))),
        ),
        tap(currentPassword => {
          patchState(store, { currentPassword });
        }),
      ),
    );

    const copyPassword = rxMethod<string>(
      pipe(
        switchMap(value => {
          return copyToClipboard(value);
        }),
        tap(() => {
          patchState(store, { hasCopied: true, passwords: [...store.passwords(), store.currentPassword()] });
          store.messageService.add({ severity: 'success', detail: 'Passwort wurde erfolgreich kopiert' });
        }),
        catchError(err => {
          store.messageService.add({ severity: 'error', detail: 'Beim kopieren ist etwas schief gelaufen' });
          return err;
        }),
      ),
    );

    const deletePassword = (password: string) => {
      patchState(store, {
        passwords: store.passwords().filter(p => p !== password),
      });
    };

    return {
      generatePassword,
      deletePassword,
      copyPassword,
    };
  }),
);
