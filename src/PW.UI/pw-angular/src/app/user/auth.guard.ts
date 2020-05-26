﻿import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@app/user/auth.service';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    const isLoggedIn = this.authService.loggedIn();
    const isLoginForm = route.routeConfig.path === 'login-form';
    const isRegisterForm = route.routeConfig.path === 'register-form';

    if (isLoggedIn && isLoginForm) {
      this.router.navigate(['/']);
      return false;
    }

    if (!isLoggedIn && !isLoginForm && !isRegisterForm) {
      this.router.navigate(['/login-form']);
    }

    return isLoggedIn || isLoginForm || isRegisterForm;
  }
}
