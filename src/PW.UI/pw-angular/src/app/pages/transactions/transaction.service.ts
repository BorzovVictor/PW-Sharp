import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient} from '@angular/common/http';
import {HttpHelpersService} from '@app/shared/helpers/http-helpers.service';
import {Transaction, TransferNewDocumentModel} from '@app/shared/models';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  prefix = `${environment.apiUrl}/api/documents/transactions`;

  constructor(private http: HttpClient,
              private httpHelper: HttpHelpersService) {

  }

  loadData(filter): Observable<Transaction[]> {
    const params = this.httpHelper.getParams(filter);
    return this.http.get<Transaction[]>(this.prefix, {params});
  }

  create(model: TransferNewDocumentModel): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.prefix}/create`, model);
  }
}