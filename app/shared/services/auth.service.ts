import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { shareReplay, tap } from 'rxjs/operators';
import * as AppSettings from 'application-settings';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _url: string;
  constructor(private http: HttpClient) {
    if (AppSettings.hasKey('token')) {
      AppSettings.getString('token', '');
      AppSettings.getString('url', '');
    }
  }

  login(url: string, email: string, password: string) {
    let endpoint = url + '/api/auth/login';
    return this.http.post<any>(endpoint, { email, password }).pipe(
      tap(token => {
        this._url = url;
        this.setSession(token);
      }),
      shareReplay()
    );
  }

  private setSession(token: string) {
    AppSettings.setString('token', token);
    AppSettings.setString('url', this._url);
  }

  get url(): string {
    return this._url;
  }

  logout() {
    AppSettings.clear();
  }

  isLoggedIn(): boolean {
    return AppSettings.hasKey('token');
  }
}
