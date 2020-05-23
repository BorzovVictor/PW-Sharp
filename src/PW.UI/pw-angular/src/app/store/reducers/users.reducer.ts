import {USER_ACTION} from '@app/store/actions/users.action';
import {User} from '@app/shared/models';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface UserState {
  currentUser: User;
  users: User[];
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

export function usersReducer(state = initialState, action): UserState {
  switch (action.type) {
    case USER_ACTION.USER_CURRENT:
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
}
