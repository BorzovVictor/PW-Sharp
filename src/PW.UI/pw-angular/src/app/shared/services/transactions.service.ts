import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpHelpersService} from '@app/shared/helpers/http-helpers.service';
import {TransactionModel} from '@app/shared/models';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  prefix = `${environment.apiUrl}/api/documents/transactions`;

  constructor(private http: HttpClient,
              private httpHelper: HttpHelpersService) {

  }

  loadData(filter): Observable<TransactionModel[]> {
    const params = this.httpHelper.getParams(filter);
    return this.http.get<TransactionModel[]>(this.prefix, {params});
  }
}
