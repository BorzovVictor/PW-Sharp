import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@app/shared/shared.module';
import {StoreModule} from '@ngrx/store';
import {usersReducer} from '@app/user/state/users.reducer';
import {LoginFormModule} from '@app/user/login-form/login-form.component';
import {RegisterFormModule} from '@app/user/register-form/register-form.component';
import {EffectsModule} from '@ngrx/effects';
import {UserEffects} from '@app/user/state/user.effects';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
    LoginFormModule,
    RegisterFormModule
  ]
})
export class UserModule {
}
