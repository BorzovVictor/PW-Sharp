import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {environment} from '@environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from '@app/shared/services/token.interseptor';
import {AppErrorHandler} from '@app/shared/helpers/app-error.handler';

import {AppComponent} from './app.component';
import {SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule} from './layouts';
import {FooterModule, LoginFormModule} from './shared/components';
import {RegisterFormModule} from '@app/shared/components/register-form/register-form.component';
import {ToastrModule} from 'ngx-toastr';
import {AppInfoService, ScreenService} from '@app/shared/services';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {usersReducer} from '@app/store/reducers/users.reducer';
import {transactionsReducer} from '@app/store/reducers/transactions.reducer';
import {transferDocReducer} from '@app/store/reducers/trnsfer-doc.reducer';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    RegisterFormModule,
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    StoreModule.forRoot({}),
    StoreModule.forFeature('users', usersReducer),
    StoreModule.forFeature('transactions', transactionsReducer),
    StoreModule.forFeature('transferDocuments', transferDocReducer),
    StoreDevtoolsModule.instrument({
      name: 'PW',
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    ScreenService,
    AppInfoService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
