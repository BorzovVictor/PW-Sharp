import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {TransactionService, TransferDocumentsService} from '@app/shared/services';
import * as tranActions from '../state/transactions.action';
import {Transaction, TransferNewDocumentModel} from '@app/shared/models';

@Injectable()
export class TransactionEffects {
  constructor(private actions$: Actions,
              private service: TransactionService) {
  }

  @Effect()
  loadTransactions$ = this.actions$.pipe(
    ofType(tranActions.TransactionActionsType.Load),
    mergeMap((action: tranActions.Load) => this.service.loadData(action.payload).pipe(
      map((values: Transaction[]) => new tranActions.LoadSuccess(values)),
      catchError(err => of(new tranActions.LoadFail(err)))
    ))
  );

  @Effect()
  createTransaction$ = this.actions$.pipe(
    ofType(tranActions.TransactionActionsType.Create),
    map((action: tranActions.Create) => action.payload),
    mergeMap((doc: TransferNewDocumentModel) => this.service.create(doc).pipe(
      map(newDoc => (new tranActions.CreateSuccess(newDoc))),
      catchError(err => of(new tranActions.CreateFail(err)))
      )
    )
  );
}
