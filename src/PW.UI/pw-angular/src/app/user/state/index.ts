/* NgRx */
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UserState} from '@app/user/state/users.reducer';


// selector functions
const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getUsers = createSelector(
  getUserFeatureState,
  state => state.users
);

export const selectUser = createSelector(
  getUsers,
  users => (key: number) => users[key]
);
