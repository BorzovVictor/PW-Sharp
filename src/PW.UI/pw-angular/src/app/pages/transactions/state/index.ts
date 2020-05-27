import * as fromRoot from '@app/store/state/app.state';
import {Transaction} from '@app/shared/models';
import {createFeatureSelector, createSelector} from '@ngrx/store';

// state
export interface State extends fromRoot.State {
  transactions: TransactionState;
}

export interface TransactionState {
  transactions: Transaction[];
  error: string;
}

// selectors
const getTransactionsFeatureState = createFeatureSelector<TransactionState>('transactions');

export const getTransactions = createSelector(
  getTransactionsFeatureState,
  state => state.transactions
);

export const getError = createSelector(
  getTransactionsFeatureState,
  state => state.error
);
