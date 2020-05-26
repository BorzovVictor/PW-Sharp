import {Action} from '@ngrx/store';
import {User, UserLookUpModel} from '@app/shared/models';

export enum UserActionsType {
  GetCurrentUser = '[User] Get Current User',
  Load = '[User] Load',
  LoadSuccess = '[User] Load Success',
  LoadFail = '[User] Load Fail'
}

export class Load implements Action {
  readonly type = UserActionsType.Load;
}

export class LoadSuccess implements Action {
  readonly type = UserActionsType.LoadSuccess;

  constructor(public payload: UserLookUpModel[]) {
  }
}

export class GetCurrentUser implements Action {
  readonly type = UserActionsType.GetCurrentUser;

  constructor(public payload: User) {
  }
}

export type UsersAction = Load | LoadSuccess | GetCurrentUser;

