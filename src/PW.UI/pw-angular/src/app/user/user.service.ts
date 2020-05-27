import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User, UserLookUpModel} from '../shared/models';
import {HttpHelpersService} from '@app/shared/helpers';

import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  prefix = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient,
              private httpHelpers: HttpHelpersService
  ) {
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.prefix}/getSelfInfo`)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  loadAll(loadOptions?): Observable<UserLookUpModel[]> {
    let params = this.httpHelpers.getParams(loadOptions);
    params = params.set('exceptSelf', 'false');
    return this.http.get<UserLookUpModel[]>(this.prefix, {params})
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    console.log({err});
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    return throwError(errorMessage);
  }
}
