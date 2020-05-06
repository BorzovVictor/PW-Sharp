﻿import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

import {User} from '../models';
import {environment} from '@environments/environment';
import {UserInfoModel} from '@app/shared/models/users/user-info.model';
import {UserRegisterModel} from '@app/shared/models/users/user-register.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private prefix = `${environment.apiUrl}/api/auth`;
  token: string;

  jwtHelper = new JwtHelperService();
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(environment.tokenName)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.prefix}/login`, {email, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(environment.tokenName, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(model: UserRegisterModel): Observable<UserInfoModel> {
    return this.http.post<UserInfoModel>(`${this.prefix}/register`, model);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(environment.tokenName);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login-form']);
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired(this.currentUserValue?.token);
  }

  getToken() {
    return this.currentUserValue?.token;
  }

  get isLoggedIn() {
    return this.loggedIn;
  }
}
