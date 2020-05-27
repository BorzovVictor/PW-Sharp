import {Action} from '@ngrx/store';
import {User, UserLookUpModel} from '@app/shared/models';

export enum UserActionsType {
  GetCurrentUser = '[User] Get Current User',
  GetCurrentUserSuccess = '[User] Get Current User Success',
  GetCurrentUserFail = '[User] Get Current User Fail',
  Load = '[User] Load',
  LoadSuccess = '[User] Load Success',
  LoadFail = '[User] Load Fail',
  LogIn = '[User] logIn',
  LogInSuccess = '[User] LogIn Success',
  LogInFail = '[User] LogIn Fail',
  Register = '[User] Register',
  RegisterSuccess = '[User] Register Success',
  RegisterFail = '[User] Register Fail',
}

// load users
export class Load implements Action {
  readonly type = UserActionsType.Load;
}

export class LoadSuccess implements Action {
  readonly type = UserActionsType.LoadSuccess;

  constructor(public payload: UserLookUpModel[]) {
  }
}

export class LoadFail implements Action {
  readonly type = UserActionsType.LoadFail;

  constructor(public payload: string) {
  }
}

export class GetCurrentUser implements Action {
  readonly type = UserActionsType.GetCurrentUser;
}

export class GetCurrentUserSuccess implements Action {
  readonly type = UserActionsType.GetCurrentUserSuccess;

  constructor(public payload: User) {
  }
}

export class GetCurrentUserFail implements Action {
  readonly type = UserActionsType.GetCurrentUserFail;

  constructor(public payload: string) {
  }
}

// login user
export class LogIn implements Action {
  readonly type = UserActionsType.LogIn;
  constructor(public payload: { login: string; password: string }) {
  }
}

export class LogInSuccess implements Action {
  readonly type = UserActionsType.LogInSuccess;

  constructor(public payload: User) {
  }
}

export class LogInFail implements Action {
  readonly type = UserActionsType.LogInFail;

  constructor(public payload: string) {
  }
}

export type UsersAction = Load | LoadSuccess | LoadFail |
  GetCurrentUser | GetCurrentUserSuccess | GetCurrentUserFail |
  LogIn | LogInSuccess | LogInFail;

