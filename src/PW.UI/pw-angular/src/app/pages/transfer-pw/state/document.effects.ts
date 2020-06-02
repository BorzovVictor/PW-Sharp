import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {TransferDocumentsService} from '@app/shared/services';

import * as docActions from './documents.actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {TransferDocument, TransferNewDocumentModel} from '@app/shared/models';
import {of} from 'rxjs';

@Injectable()
export class DocumentEffects {
  constructor(private actions$: Actions,
              private service: TransferDocumentsService) {
  }

  @Effect()
  loadDocuments$ = this.actions$.pipe(
    ofType(docActions.DocumentActionTypes.Load),
    mergeMap((action: docActions.Load) => this.service.load(action.payload).pipe(
      map((values: TransferDocument[]) => new docActions.LoadSuccess(values)),
      catchError(err => of(new docActions.LoadFail(err)))
    ))
  );

  @Effect()
  createDocument$ = this.actions$.pipe(
    ofType(docActions.DocumentActionTypes.Create),
    map((action: docActions.Create) => action.payload),
    mergeMap((model: TransferNewDocumentModel) => this.service.create(model).pipe(
      map(newDoc => (new docActions.CreateSuccess(newDoc))),
      catchError(err => of(new docActions.CreateFail(err)))
    ))
  );
}
