import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpHelpersService {
  filterProps = [
    'sort',
    'skip',
    'take',
    'filter',
    'searchExpr',
    'searchOperation',
    'searchValue',
    'group'
  ];


  getParams(filter): HttpParams {
    let params: HttpParams = new HttpParams();
    this.filterProps.forEach((i) => {
      if (i in filter && (filter[i])) {
        params = params.set(i, JSON.stringify(filter[i]));
      }
    });
    return params;
  }
}
