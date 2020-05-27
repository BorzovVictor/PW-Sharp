import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import {DxButtonModule} from 'devextreme-angular/ui/button';
import {DxCheckBoxModule} from 'devextreme-angular/ui/check-box';
import {DxTextBoxModule} from 'devextreme-angular/ui/text-box';
import {DxValidatorModule} from 'devextreme-angular/ui/validator';
import {DxValidationGroupModule} from 'devextreme-angular/ui/validation-group';
import {environment} from '@environments/environment';
import {AppInfoService, AppNotifyService, AuthService} from '@services/index';
import {select, Store} from '@ngrx/store';

import {UserState} from '@app/user/state/users.reducer';
import * as userActions from '@app/user/state/users.action';
import * as fromUsers from '@app/user/state';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  login = 'admin@pw.com';
  password = '';
  returnUrl: string;
  private componentActive = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public appInfo: AppInfoService,
    private notify: AppNotifyService,
    private store: Store<UserState>
  ) {

    // this.store.dispatch(new userActions.GetCurrentUser());
    // this.store.pipe(select(fromUsers.getCurrentUser))
    //   .subscribe((user: User) => {
    //     console.log({user});
    //     if (user) {
    //       this.router.navigate(['/']);
    //     }
    //   });

    // todo to try redirect on router

    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.login = localStorage.getItem(environment.loginStorageKey) || '';
  }

  onPasswordSubmit(e) {
    if (e.event.code === 'Enter') {
      this.onLoginClick(e);
    }
  }

  onLoginClick(args) {
    console.log(args);
    if (!args.validationGroup.validate().isValid) {
      return;
    }

    this.store.dispatch(new userActions.LogIn({login: this.login, password: this.password}));
    this.store.pipe(select(fromUsers.logIn)).subscribe(
      (user) => {
        console.log(user);
        // this.notify.info(`Welcome ${user.userName}`, '', true);
      },
      error => {
        this.notify.error(error, 'Error', true);
      },
      () => {
        this.router.navigate(['']);
        args.validationGroup.reset();
      }
    );

    // this.authService.login(this.login, this.password).subscribe((user: UserWithToken) => {
    //     this.notify.info(`Welcome ${user.userName}`, '', true);
    //   },
    //   error => {
    //     this.notify.error(error, 'Error', true);
    //   },
    //   () => {
    //     this.router.navigate(['']);
    //     args.validationGroup.reset();
    //   });
  }

  createAccount(e: any) {
    console.log({e});
    this.router.navigate(['/register-form']);
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationGroupModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent]
})
export class LoginFormModule {
}
