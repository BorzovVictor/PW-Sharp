import {Injectable, Output} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserLookUpModel} from '../shared/models';
import {HttpHelpersService} from '@app/shared/helpers';
import {Store} from '@ngrx/store';
import {UserState} from './state/users.reducer';
import {GetCurrentUser, Load} from '@app/user/state/users.action';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  prefix = `${environment.apiUrl}/api/users`;

  refreshBalance = false;

  constructor(private http: HttpClient,
              private httpHelpers: HttpHelpersService,
              private store: Store<UserState>
  ) {
  }

  getSelfInfo(): Promise<User> {
    return this.http.get<User>(`${this.prefix}/getSelfInfo`).toPromise()
      .then((user: User) => {
        this.store.dispatch(new GetCurrentUser(user));
        return user;
      });
  }

  // load(loadOptions): Promise<any> {
  //   const params = this.httpHelpers.getParams(loadOptions);
  //   return this.http.get<UserLookUpModel[]>(this.prefix, {params}).toPromise()
  //     .then((users: UserLookUpModel[]) => {
  //       this.store.dispatch(new Load(users));
  //       return {data: users, totalCount: users?.length};
  //     });
  // }

  loadAll(loadOptions?): Observable<UserLookUpModel[]> {
    let params = this.httpHelpers.getParams(loadOptions);
    params = params.set('exceptSelf', 'false');
    return this.http.get<UserLookUpModel[]>(this.prefix, {params});
  }

  getById(key: number) {
    return this.http.get<UserLookUpModel>(`${this.prefix}/${key}`);
  }

  balanceChanged() {
    this.refreshBalance = true;
  }
}
