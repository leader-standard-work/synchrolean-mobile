import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

import * as AppSettings from 'tns-core-modules/application-settings/application-settings';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (AppSettings.hasKey('token')) {
      const token = AppSettings.getString('token', '');
      const clone = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      return next.handle(clone);
    } else {
      return next.handle(req);
    }
  }
}
