import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {TransferDocumentsModel, TransferNewDocumentModel} from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TransferDocumentsService {
  prefix = `${environment.apiUrl}/api/documents`;

  constructor(private http: HttpClient) {

  }

  load(): Observable<TransferDocumentsModel[]> {
    return this.http.get<TransferDocumentsModel[]>(`${this.prefix}/transferDocuments`);
  }

  create(model: TransferNewDocumentModel): Observable<TransferDocumentsModel> {
    return this.http.post<TransferDocumentsModel>(`${this.prefix}/create`, model);
  }
}
