import {Component, NgModule, OnInit, ViewChild} from '@angular/core';

import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';

import {
  DxButtonModule,
  DxCheckBoxModule,
  DxLoadPanelModule,
  DxTextBoxModule, DxValidationGroupComponent,
  DxValidationGroupModule,
  DxValidatorModule
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import {environment} from '@environments/environment';
import {UserRegisterModel} from '@app/shared/models/users/user-register.model';
import {AuthService} from '@app/user/auth.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  appTitle = environment.appTitle;
  @ViewChild('validationGroup') validationGroup: DxValidationGroupComponent;
  regModel: UserRegisterModel;
  loadingPanelVisible = false;

  passwordComparison = () => {
    return this.regModel.password;
  }

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.regModel = ({} as UserRegisterModel);
  }

  onRegisterClick(args) {
    console.log(args);
    if (!args.validationGroup.validate().isValid) {
      return;
    }
    this.register();
  }

  onSubmit(e: Event) {
    this.register();
    e.preventDefault();
  }

  register() {
    this.loadingPanelVisible = true;
    this.authService.register(this.regModel).subscribe(next => {
      notify(`Congratulations ${this.regModel.userName}! You have successfully registered.`, 'success', 3000);
      this.loadingPanelVisible = false;
      localStorage.setItem(environment.loginStorageKey, this.regModel.email);
      this.validationGroup.instance.reset();
    }, error => {
      console.log(error.error);
      notify(error.error, 'error', 3000);
      this.loadingPanelVisible = false;
    }, () => {
      this.router.navigate(['/login-form']);
      this.loadingPanelVisible = false;
    });
  }

  onLoginClick(e: any) {
    this.router.navigate(['/login-form']);
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
    DxValidationGroupModule,
    DxLoadPanelModule
  ],
  declarations: [RegisterFormComponent],
  exports: [RegisterFormComponent]
})
export class RegisterFormModule {
}
