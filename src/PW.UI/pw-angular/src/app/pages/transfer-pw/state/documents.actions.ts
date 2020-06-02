import {Action} from '@ngrx/store';
import {TransferDocument, TransferNewDocumentModel} from '@app/shared/models';

export enum DocumentActionTypes {
  Load = '[Documents] Load documents',
  LoadSuccess = '[Documents] Load success',
  LoadFail = '[Documents] Load fail',
  Create = '[Documents] Create new document',
  CreateSuccess = '[Documents] Create Success',
  CreateFail = '[Documents] Create Fail',
}

export class Load implements Action {
  readonly type = DocumentActionTypes.Load;

  constructor(public payload?: any) {
  }
}

export class LoadSuccess implements Action {
  readonly type = DocumentActionTypes.LoadSuccess;

  constructor(public payload: TransferDocument[]) {
  }
}


export class LoadFail implements Action {
  readonly type = DocumentActionTypes.LoadFail;

  constructor(public payload: string) {
  }
}

export class Create implements Action {
  readonly type = DocumentActionTypes.Create;

  constructor(public payload: TransferNewDocumentModel) {
  }
}

export class CreateSuccess implements Action {
  readonly type = DocumentActionTypes.CreateSuccess;

  constructor(public payload: TransferDocument) {
  }
}

export class CreateFail implements Action {
  readonly type = DocumentActionTypes.CreateFail;

  constructor(public payload: string) {
  }
}

export type DocumentActions = Load | LoadSuccess | LoadFail |
  Create | CreateSuccess | CreateFail;
