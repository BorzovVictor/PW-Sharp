import {Action} from '@ngrx/store';
import {User} from '@app/shared/models';

export enum USER_ACTION {
  USER_CURRENT = 'USER_CURRENT'
}

export class UserCurrent implements Action {
  readonly type = USER_ACTION.USER_CURRENT;

  constructor(public payload: User) {}
}
