import {Action} from '@ngrx/store';
import {User, UserLookUpModel} from '@app/shared/models';

export enum UserActions {
  GetCurrentUser = '[Users] Get current user',
  LoadUsers = '[Users] Load users'
}

export class UsersLoad implements Action {
  readonly type = UserActions.LoadUsers;
  constructor(public payload: UserLookUpModel[]) {}
}

export class GetCurrentUser implements Action {
  readonly type = UserActions.GetCurrentUser;
  constructor(public payload: User) {}
}

export type UsersAction = UsersLoad | GetCurrentUser;

