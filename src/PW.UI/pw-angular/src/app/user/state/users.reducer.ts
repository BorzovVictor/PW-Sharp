import {UserActionsType, UsersAction} from '@app/user/state/users.action';
import {User, UserLookUpModel} from '@app/shared/models';

// state for feature (Users)
export interface UserState {
  currentUser: User;
  users: UserLookUpModel[];
  error: string;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  error: ''
};


export function usersReducer(state = initialState, action: UsersAction): UserState {
  switch (action.type) {
    // get current user
    case UserActionsType.GetCurrentUserSuccess:
      return {
        ...state,
        currentUser: action.payload,
        error: ''
      };

    case UserActionsType.GetCurrentUserFail:
      return {
        ...state,
        currentUser: null,
        error: action.payload
      };

    // load users
    case UserActionsType.LoadSuccess:
      return {
        ...state,
        users: action.payload,
        error: ''
      };
    case UserActionsType.LoadFail:
      return {
        ...state,
        users: [],
        error: action.payload
      };

    // logIn user
    case UserActionsType.LogInSuccess:
      return {
        ...state,
        currentUser: action.payload,
        error: ''
      };
    case UserActionsType.LogInFail:
      return {
        ...state,
        currentUser: null,
        error: action.payload
      };

    default:
      return state;
  }
}
