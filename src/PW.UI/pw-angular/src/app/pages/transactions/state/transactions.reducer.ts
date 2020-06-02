import {TransactionActionsType} from '@app/pages/transactions/state/transactions.action';
import {TransactionState} from '@app/pages/transactions/state/index';

const initialState: TransactionState = {
  transactions: [],
  error: ''
};

export function transactionsReducer(state = initialState, action): TransactionState {
  switch (action.type) {
    // load transaction
    case TransactionActionsType.LoadSuccess:
      return {
        ...state,
        transactions: action.payload,
        error: ''
      };
    case TransactionActionsType.LoadFail:
      return {
        ...state,
        transactions: [],
        error: action.payload
      };

    // create transaction
    case TransactionActionsType.CreateSuccess:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        error: ''
      };
    case TransactionActionsType.CreateFail:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}
