import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '~/shared/models/account';
import { AuthenticationService } from '~/shared/services/auth.service';
import { Team } from '~/shared/models/team';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  account: Account;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Registers a user account
   * @param url The url of the server to send registration
   * @param account The account to send to the server
   * @returns Observable<Account> account verification.
   */
  register(url: string, account: Account): Observable<Account> {
    const endpoint = url + '/api/accounts';
    return this.http.post<Account>(endpoint, account);
  }

  /**
   * Retrieves the account information for a given user email
   * @param email the email of the user account
   * @returns Observable<Account> account requested
   */
  getAccountByEmail(email: string): Observable<Account> {
    const endpoint = this.authService.url + '/api/accounts/' + email;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Retrieves the teams that an account belongs to
   * @param id the user id
   * @returns Observal
   */
  getTeamsForAccount(email: string): Observable<Team[]> {
    const endpoint = this.authService.url + '/api/accounts/teams/' + email;
    return this.http.get<Team[]>(endpoint);
  }
}
