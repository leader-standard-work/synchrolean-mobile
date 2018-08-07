import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '~/shared/services/account.service';
import { AuthenticationService } from '~/shared/services/auth.service';

import { Team, TeamServerInterface } from '~/shared/models/team';
import { Account, AccountServerInterface } from '~/shared/models/account';
import { Task } from '~/shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private _url: string;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private accountService: AccountService
  ) {
    if (authenticationService.isLoggedIn()) {
      this._url = this.authenticationService.url;
    } else {
      this._url = '';
    }
  }

  /****************** Begin Accounts Requests ********************/
  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  login(serverUrl: string, email: string, password: string): Observable<any> {
    this._url = serverUrl;
    return this.authenticationService.login(serverUrl, email, password);
  }

  logout() {
    this._url = '';
    this.authenticationService.logout();
  }

  register(
    serverUrl: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Observable<Account> {
    this._url = serverUrl;
    let endpoint = this._url + '/api/accounts';
    let body = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password
    };
    return this.http
      .post<AccountServerInterface>(endpoint, body)
      .pipe(map(response => new Account(response)));
  }

  getAccountByEmail(email: string): Observable<Account> {
    let endpoint = this._url + '/api/accounts/' + email;
    return this.http.get<Account>(endpoint);
  }

  /****************** End Accounts Requests **********************/
  /****************** Begin Team Requests ************************/
  getTeams(): Observable<Team[]> {
    let endpoint = this._url + '/api/team';
    return this.http
      .get<TeamServerInterface[]>(endpoint)
      .pipe(
        map(responseArray =>
          responseArray.map(
            teamServerInterface => new Team(teamServerInterface)
          )
        )
      );
  }

  getTeam(id: number): Observable<Team> {
    let endpoint = this._url + '/api/team/' + id;
    return this.http
      .get<TeamServerInterface>(endpoint)
      .pipe(map(response => new Team(response)));
  }

  addTeam(name: string, description: string) {
    let endpoint = this._url + '/api/team';
    let body = {
      ownerId: this.accountService.account.ownerId,
      teamName: name,
      teamDescription: description
    };
    return this.http
      .post<TeamServerInterface>(endpoint, body)
      .pipe(map(response => new Team(response)));
  }

  editTeam(team: Team) {}

  getTeamMembers(id: number): Observable<Account[]> {
    let endpoint = this._url + '/api/team/members/' + id;
    return this.http
      .get<AccountServerInterface[]>(endpoint)
      .pipe(map(accounts => accounts.map(account => new Account(account))));
  }

  inviteToTeam(userId: number, ownerId: number, teamid: number) {
    let endpoint =
      this._url + '/api/team/invite/' + userId + '/' + ownerId + '/' + teamid;
    let body = '';
    return this.http.put(endpoint, body);
  }

  /****************** End Team Requests **************************/
  /****************** Begin Task Requests ************************/
  getuserTodo(userId: number): Observable<Task[]> {
    let endpoint = this._url + '/api/tasks/todo/' + userId;
    return this.http.get<Task[]>(endpoint);
  }
  /****************** End Task Requests **************************/
}
