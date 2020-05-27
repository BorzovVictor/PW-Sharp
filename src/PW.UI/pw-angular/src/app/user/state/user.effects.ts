import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {UserService} from '@app/user/user.service';
import * as userActions from './users.action';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {User, UserLookUpModel} from '@app/shared/models';
import {of} from 'rxjs';
import {AuthService} from '@app/user/auth.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions,
              private userService: UserService,
              private authService: AuthService
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(userActions.UserActionsType.Load),
    mergeMap((action: userActions.Load) => this.userService.loadAll().pipe(
      map((users: UserLookUpModel[]) => (new userActions.LoadSuccess(users))),
      catchError(error => of(new userActions.LoadFail(error)))
      )
    )
  );

  @Effect()
  getCurrentUser$ = this.actions$.pipe(
    ofType(userActions.UserActionsType.GetCurrentUser),
    mergeMap((action: userActions.GetCurrentUser) => this.userService.getCurrentUser().pipe(
      map((user: User) => new userActions.GetCurrentUserSuccess(user)),
      catchError(error => of(new userActions.LoadFail(error)))
      )
    )
  );

  @Effect()
  logIn$ = this.actions$.pipe(
    ofType(userActions.UserActionsType.LogIn),
    mergeMap((action: userActions.LogIn) => this.authService.login(action.payload.login, action.payload.password).pipe(
      map(user => new userActions.LogInSuccess(user)),
      catchError(error => of(new userActions.LogInFail(error)))
    )),
  );
}
