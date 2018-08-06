import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { shareReplay, tap } from 'rxjs/operators';
import * as AppSettings from 'application-settings';

import { AccountServerInterface } from '~/shared/models/account';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    let endpoint = 'api/login';
    return this.http
      .post<AccountServerInterface>(endpoint, { email, password })
      .pipe(
        tap(response => {
          this.setSession(response);
        }),
        shareReplay()
      );
  }

  private setSession(accountServerInterface: AccountServerInterface) {
    AppSettings.setString('token', accountServerInterface.token)
  }

  logout() {
    AppSettings.clear();
  }

  
}
