import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';

import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from '@app/user/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService,
              private router: Router
  ) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      // navigate /delete cookies or whatever
      this.router.navigate(['/login-form']);
      // if you've caught / handled the error, you don't want to rethrow it
      // unless you also want downstream consumers to have to handle it as well.
      return of(err.message);
    }
    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isLoggedIn()) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.auth.getToken()
        }
      });
    }

    return next.handle(req).pipe(
      catchError(
        (err => {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.auth.logout();
            location.reload();
          }

          const error = err.error.message || err.statusText;
          return throwError(error);
        })
      ),
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status !== 200) {
          console.log('event--->>>', event);
        }
        return event;
      }));
  }
}
