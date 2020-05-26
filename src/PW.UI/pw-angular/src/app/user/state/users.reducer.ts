import {UserActionsType, UsersAction} from '@app/user/state/users.action';
import {User, UserLookUpModel} from '@app/shared/models';

// state for feature (Users)
export interface UserState {
  currentUser: User;
  users: UserLookUpModel[];
}

const initialState: UserState = {
  currentUser: null,
  users: []
};


export function usersReducer(state = initialState, action: UsersAction): UserState {
  switch (action.type) {
    case UserActionsType.GetCurrentUser:
      return {
        ...state,
        currentUser: action.payload
      };
    case UserActionsType.LoadSuccess:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}
