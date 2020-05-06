import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfoModel, UserLookUpModel} from '../models';
import {HttpHelpersService} from '@app/shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  prefix = `${environment.apiUrl}/api/users`;

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  refreshBalance = false;

  constructor(private http: HttpClient,
              private httpHelpers: HttpHelpersService) {
  }

  getSelfInfo(): Observable<UserInfoModel> {
    return this.http.get<UserInfoModel>(`${this.prefix}/getSelfInfo`);
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
    this.change.emit(this.refreshBalance);
  }
}
