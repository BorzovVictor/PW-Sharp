import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {HttpHelpersService} from '@app/shared/helpers/http-helpers.service';
import {Transaction} from '@app/shared/models';
import {Store} from '@ngrx/store';
import * as fromTransaction from '@app/pages/transactions/state';
import {Load} from '@app/pages/transactions/state/transactions.action';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  prefix = `${environment.apiUrl}/api/documents/transactions`;

  constructor(private http: HttpClient,
              private httpHelper: HttpHelpersService,
              private store: Store<fromTransaction.State>) {

  }

  loadData(filter): Observable<Transaction[]> {
    const params = this.httpHelper.getParams(filter);
    return this.http.get<Transaction[]>(this.prefix, {params});
  }
}
