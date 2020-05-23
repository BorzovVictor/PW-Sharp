import {Transaction} from '@app/shared/models';
import * as fromRoot from '../state/app.state';
import {TRANSACTION_ACTION} from '@app/store/actions/transactions.action';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface State extends fromRoot.State {
  transactions: TransactionState;
}

export interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: []
};

const getTransactionsFeatureState = createFeatureSelector<TransactionState>('transactions');

export const getTransactions = createSelector(
  getTransactionsFeatureState,
  state => state.transactions
);

export function transactionsReducer(state = initialState, action): TransactionState {
  switch (action.type) {
    case TRANSACTION_ACTION.TRANSACTION_LOAD:
      return {
        ...state,
        transactions: action.payload
      };
    default:
      return state;
  }
}
