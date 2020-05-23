import {Action} from '@ngrx/store';
import {TransferDocument} from '@app/shared/models';

export enum DocumentActionTypes {
  LoadDocuments = '[Documents] Load documents',
  CreateDocument = '[Documents] Create new document'
}

export class DocumentsLoad implements Action {
  readonly type = DocumentActionTypes.LoadDocuments;

  constructor(public payload: TransferDocument[]) {
  }
}

export class DocumentCreate implements Action {
  readonly type = DocumentActionTypes.CreateDocument;

  constructor(public payload: TransferDocument) {
  }
}

export type DocumentActions = DocumentsLoad | DocumentCreate;
