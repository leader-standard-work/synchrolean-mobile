import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as AppSettings from 'tns-core-modules/application-settings/application-settings';
import * as JWT from 'jwt-decode';

@Injectable()
export class AuthenticationService {
  token: string;
  userId: number;
  email: string;
  url: string;

  constructor(private http: HttpClient) {
    if (AppSettings.hasKey('token')) {
      this.token = AppSettings.getString('token', '');
      this.email = AppSettings.getString('email', '').toLowerCase();
      this.url = AppSettings.getString('url', '');
      let jwt = JWT(this.token);
      this.userId = jwt['OwnerId'];
    }
  }

  /**
   * Log into the account for a given email
   * @param url the url of the server to send to
   * @param email the email of the account
   * @param password the password for the account
   * @returns Observable<any> with the JWT of the user.
   */
  login(url: string, email: string, password: string): Observable<any> {
    let endpoint = url + '/api/auth/login';
    let body = { email, password };
    return this.http.post<any>(endpoint, body);
  }

  /**
   * Will set the url, and JWT into app settings
   * @param token a JWT for a logged in user
   */
  setSession(url: string, email: string, token: string) {
    this.url = url;
    this.email = email;
    this.token = token;
    let jwt = JWT(token);
    this.userId = jwt['OwnerId'];
    AppSettings.setString('url', this.url);
    AppSettings.setString('email', this.email);
    AppSettings.setString('token', this.token);
  }

  logout() {
    this.url = '';
    this.email = '';
    this.token = '';
    this.userId = -1;
    AppSettings.clear();
  }

  isLoggedIn(): boolean {
    return AppSettings.hasKey('token');
  }
}
