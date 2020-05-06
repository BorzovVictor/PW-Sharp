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
