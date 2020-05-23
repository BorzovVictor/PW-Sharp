import {User, UserLookUpModel} from '@app/shared/models';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UserActions, UsersAction} from '@app/store/actions/users.action';

export interface UserState {
  currentUser: User;
  users: UserLookUpModel[];
}

const initialState: UserState = {
  currentUser: null,
  users: []
};

const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getUsers = createSelector(
  getUserFeatureState,
  state => state.users
);

export function usersReducer(state = initialState, action: UsersAction): UserState {
  switch (action.type) {
    case UserActions.GetCurrentUser:
      return {
        ...state,
        currentUser: action.payload
      };
    case UserActions.LoadUsers:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}
