import * as fromRoot from '../state/app.state';
import {TransferDocument} from '@app/shared/models';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DocumentActions, DocumentActionTypes} from '@app/store/actions/documents.actions';

export interface State extends fromRoot.State {
  documents: TransferState;
}

export interface TransferState {
  documents: TransferDocument[];
}

const initialState: TransferState = {
  documents: []
};

const getDocumentsFeatureState = createFeatureSelector<TransferState>('transferDocuments');

export const getDocuments = createSelector(
  getDocumentsFeatureState,
  state => state.documents
);

export function transferDocReducer(state = initialState, action: DocumentActions): TransferState {
  switch (action.type) {
    case DocumentActionTypes.LoadDocuments:
      return {
        ...state,
        documents: action.payload
      };
    case DocumentActionTypes.CreateDocument:
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    default:
      return state;
  }
}
