import {Injectable, Output} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserLookUpModel} from '../models';
import {HttpHelpersService} from '@app/shared/helpers';
import {Store} from '@ngrx/store';
import {UserCurrent} from '@app/store/actions/users.action';
import {UserState} from '../../store/reducers/users.reducer';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  prefix = `${environment.apiUrl}/api/users`;

  refreshBalance = false;

  constructor(private http: HttpClient,
              private httpHelpers: HttpHelpersService,
              private store: Store<UserState>
  ) {
  }

  getSelfInfo(): void {
    this.http.get<User>(`${this.prefix}/getSelfInfo`).toPromise()
      .then((user: User) => {
        this.store.dispatch(new UserCurrent(user));
      });
  }

  load(loadOptions): Observable<UserLookUpModel[]> {
    const params = this.httpHelpers.getParams(loadOptions);
    return this.http.get<UserLookUpModel[]>(this.prefix, {params});
  }

  loadAll(loadOptions): Observable<UserLookUpModel[]> {
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
