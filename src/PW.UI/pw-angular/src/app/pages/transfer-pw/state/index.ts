import * as fromRoot from '@app/store/state/app.state';
import {TransferDocument} from '@app/shared/models';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State extends fromRoot.State {
  documents: TransferState;
}

export interface TransferState {
  documents: TransferDocument[];
  error: string;
}

// selectors
const getDocumentsFeatureState = createFeatureSelector<TransferState>('documents');

export const getDocuments = createSelector(
  getDocumentsFeatureState,
  state => state.documents
);

export const getError = createSelector(
  getDocumentsFeatureState,
  state => state.error
);
