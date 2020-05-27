import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {TransferDocument, TransferNewDocumentModel} from '@app/shared/models';
import {Store} from '@ngrx/store';

import * as fromDocuments from '@app/store/reducers/trnsfer-doc.reducer';
import * as documentActions from '@app/store/actions/documents.actions';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferDocumentsService {
  prefix = `${environment.apiUrl}/api/documents`;

  constructor(private http: HttpClient,
              private store: Store<fromDocuments.State>) {

  }

  load(): Promise<any> {
    return this.http.get<TransferDocument[]>(`${this.prefix}/transferDocuments`).toPromise()
      .then((docs: TransferDocument[]) => {
        // update store
        this.store.dispatch(new documentActions.DocumentsLoad(docs));
        return {data: docs, totalCount: docs?.length};
      });
  }

  create(model: TransferNewDocumentModel): Observable<TransferDocument> {
    return this.http.post<TransferDocument>(`${this.prefix}/create`, model);
  }
}
