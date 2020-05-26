import {Component, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import {DxButtonModule} from 'devextreme-angular/ui/button';
import {DxCheckBoxModule} from 'devextreme-angular/ui/check-box';
import {DxTextBoxModule} from 'devextreme-angular/ui/text-box';
import {DxValidatorModule} from 'devextreme-angular/ui/validator';
import {DxValidationGroupModule} from 'devextreme-angular/ui/validation-group';
import {environment} from '@environments/environment';
import {AppInfoService, AppNotifyService, AuthService} from '@services/index';
import {Store} from '@ngrx/store';
import {UserWithToken} from '@app/shared/models';
import {UserState} from '@app/user/state/users.reducer';
import {GetCurrentUser} from '@app/user/state/users.action';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  login = 'admin@pw.com';
  password = '';
  returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public appInfo: AppInfoService,
    private notify: AppNotifyService,
    private store: Store<UserState>
  ) {
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

    this.authService.login(this.login, this.password).subscribe((user: UserWithToken) => {
        this.store.dispatch(new GetCurrentUser(user));
        this.notify.info(`Welcome ${user.userName}`, '', true);
      },
      error => {
        this.notify.error(error, 'Error', true);
      },
      () => {
        this.router.navigate(['']);
        args.validationGroup.reset();
      });
  }

  createAccount(e: any) {
    console.log({e});
    this.router.navigate(['/register-form']);
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
