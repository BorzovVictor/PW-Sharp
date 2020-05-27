import {Action} from '@ngrx/store';
import {Transaction, TransferDocument, TransferNewDocumentModel} from '@app/shared/models';

export enum TransactionActionsType {
  Load = '[Transaction] Load',
  LoadSuccess = '[Transaction] Load Success',
  LoadFail = '[Transaction] Load Fail',
  Create = '[Transaction] Create Transaction',
  CreateSuccess = '[Transaction] Create Transaction Success',
  CreateFail = '[Transaction] Create Transaction Fail',
}

export class Load implements Action {
  readonly type = TransactionActionsType.Load;
  constructor(public payload?: any) {
  }
}

export class LoadSuccess implements Action {
  readonly type = TransactionActionsType.LoadSuccess;

  constructor(public payload: Transaction[]) {
  }
}

export class LoadFail implements Action {
  readonly type = TransactionActionsType.LoadFail;

  constructor(public payload: string) {
  }
}

// create transaction
export class Create implements Action {
  readonly type = TransactionActionsType.Create;

  constructor(public payload: TransferNewDocumentModel) {
  }
}

export class CreateSuccess implements Action {
  readonly type = TransactionActionsType.CreateSuccess;

  constructor(public payload: TransferDocument) {
  }
}

export class CreateFail implements Action {
  readonly type = TransactionActionsType.CreateFail;

  constructor(public payload: string) {
  }
}

export type TransactionsAction = Load | LoadSuccess | LoadFail |
  Create | CreateSuccess | CreateFail;
