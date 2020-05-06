import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {AppNotifyService} from '@app/shared/services';

@Injectable({providedIn: 'root'})
export class AppErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    const notify = this.injector.get(AppNotifyService);
    notify.error(error);
    super.handleError(error);
  }
}
