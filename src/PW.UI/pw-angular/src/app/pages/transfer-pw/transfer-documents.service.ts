import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {TransferDocument, TransferNewDocumentModel} from '@app/shared/models';
import {HttpHelpersService} from '@app/shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class TransferDocumentsService {
  prefix = `${environment.apiUrl}/api/documents`;

  constructor(private http: HttpClient,
              private httpHelper: HttpHelpersService) {

  }

  load(filter): Observable<TransferDocument[]> {
    const params = this.httpHelper.getParams(filter);
    return this.http.get<TransferDocument[]>(`${this.prefix}/transferDocuments`, {params});
  }

  create(model: TransferNewDocumentModel): Observable<TransferDocument> {
    return this.http.post<TransferDocument>(`${this.prefix}/create`, model);
  }
}
