import {Action} from '@ngrx/store';
import {Transaction, User} from '@app/shared/models';

export enum TRANSACTION_ACTION {
  TRANSACTION_LOAD = 'TRANSACTION_LOAD'
}

export class TransactionLoad implements Action {
  readonly type = TRANSACTION_ACTION.TRANSACTION_LOAD;

  constructor(public payload: Transaction[]) {
  }
}
