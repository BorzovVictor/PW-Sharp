import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppNotifyService {

  constructor(private notify: ToastrService) {
  }

  info(message: string, title: string = '', showProgress: boolean = false) {
    this.notify.success(message, title, {
      progressBar: showProgress
    });
  }

  warning(message: string, title: string = '', showProgress: boolean = false) {
    this.notify.warning(message, title, {
      progressBar: showProgress
    });
  }

  error(message: string, title: string = 'Error', showProgress: boolean = false) {
    this.notify.warning(message, title, {
      progressBar: showProgress
    });
  }
}
