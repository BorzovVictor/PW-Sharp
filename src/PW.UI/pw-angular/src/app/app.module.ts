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
import {RegisterFormModule} from '@app/user/register-form/register-form.component';
import {ToastrModule} from 'ngx-toastr';
import {AppInfoService, ScreenService} from '@app/shared/services';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {usersReducer} from '@app/user/state/users.reducer';
import {transactionsReducer} from '@app/pages/transactions/state/transactions.reducer';
import {transferDocReducer} from '@app/store/reducers/trnsfer-doc.reducer';
import {UserModule} from '@app/user/user.module';
import {EffectsModule} from '@ngrx/effects';
import {TransactionModule} from '@app/pages/transactions/transaction.module';
import {CreateDocModule} from '@app/shared/components/create-doc/create-doc.component';

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
    CreateDocModule,
    AppRoutingModule,
    UserModule,
    TransactionModule,
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
    EffectsModule.forRoot([]),
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
