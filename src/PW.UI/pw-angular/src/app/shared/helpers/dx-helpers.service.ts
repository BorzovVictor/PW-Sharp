import {Injectable} from '@angular/core';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root'
})
export class DxHelpersService {

  checkCRUDresult(result: Promise<any>, showMessage: boolean = false): Promise<any> {
    const e = new Promise((resolve, reject) => {
      result.then(() => {
        resolve();
      })
        .catch((error) => {
          console.log(error);
          reject(error);
          if (showMessage) {
            notify(error, 'error', 3000);
          }
        });
    });
    return e;
  }
}
