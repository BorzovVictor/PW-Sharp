﻿﻿import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Store} from '@ngrx/store';

import {UserWithToken} from '../models';
import {environment} from '@environments/environment';
import {User} from '@app/shared/models/users/user';
import {UserRegisterModel} from '@app/shared/models/users/user-register.model';
import {UserCurrent} from '@app/store/actions/users.action';

import {UserState} from '../../store/reducers/users.reducer';

@Injectable({providedIn: 'root'})
export class AuthService {
  private prefix = `${environment.apiUrl}/api/auth`;
  token: string;

  jwtHelper = new JwtHelperService();
  private currentUserSubject: BehaviorSubject<UserWithToken>;
  public currentUser: Observable<UserWithToken>;

  constructor(private http: HttpClient, private router: Router, private store: Store<UserState>) {
    this.currentUserSubject = new BehaviorSubject<UserWithToken>(JSON.parse(localStorage.getItem(environment.tokenName)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserWithToken {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.prefix}/login`, {email, password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(environment.tokenName, JSON.stringify(user));
        this.store.dispatch(new UserCurrent(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(model: UserRegisterModel): Observable<User> {
    return this.http.post<User>(`${this.prefix}/register`, model);
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