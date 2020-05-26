import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {UserService} from '@app/user/user.service';
import * as userActions from './users.action';
import {map, mergeMap} from 'rxjs/operators';
import {UserLookUpModel} from '@app/shared/models';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {
  }

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(userActions.UserActionsType.Load),
    mergeMap((action: userActions.Load) => this.userService.loadAll().pipe(
      map((users: UserLookUpModel[]) => (new userActions.LoadSuccess(users)))
      )
    )
  );
}
