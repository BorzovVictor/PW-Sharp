import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {HttpHelpersService} from '@app/shared/helpers/http-helpers.service';
import {Transaction} from '@app/shared/models';
import {Store} from '@ngrx/store';
import * as fromTransaction from '@app/store/reducers/transactions.reducer';
import {TransactionLoad} from '@app/store/actions/transactions.action';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  prefix = `${environment.apiUrl}/api/documents/transactions`;

  constructor(private http: HttpClient,
              private httpHelper: HttpHelpersService,
              private store: Store<fromTransaction.State>) {

  }

  loadData(filter) {
    const params = this.httpHelper.getParams(filter);
    return this.http.get<Transaction[]>(this.prefix, {params})
      .toPromise().then((transactions: Transaction[]) => {
        this.store.dispatch(new TransactionLoad(transactions));
        return {data: transactions, totalCount: transactions?.length};
      });
  }
}
