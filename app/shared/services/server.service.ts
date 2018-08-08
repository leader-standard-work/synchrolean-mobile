import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '~/shared/services/account.service';
// import { AuthenticationService } from '~/shared/services/auth.service';

import { Team } from '~/shared/models/team';
import { Account } from '~/shared/models/account';
import { Task } from '~/shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private _url: string;

  constructor(
    private http: HttpClient,
    // private authenticationService: AuthenticationService,
    private accountService: AccountService
  ) {
    // if (authenticationService.isLoggedIn()) {
    //   this._url = this.authenticationService.url;
    // } else {
    //   this._url = '';
    // }
  }

  /****************** Begin Accounts Requests ********************/
  // isLoggedIn(): boolean {
  //   return this.authenticationService.isLoggedIn();
  // }

  // login(serverUrl: string, email: string, password: string): Observable<any> {
  //   this._url = serverUrl;
  //   return this.authenticationService.login(serverUrl, email, password);
  // }

  // logout() {
  //   this._url = '';
  //   this.authenticationService.logout();
  // }

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
    return this.http.post<Account>(endpoint, body);
  }

  getAccountByEmail(email: string): Observable<Account> {
    let endpoint = this._url + '/api/accounts/' + email;
    return this.http.get<Account>(endpoint);
  }

  getAccountById(ownerId: number): Observable<Account> {
    let endpoint = this._url + '/api/accounts/owner/' + ownerId;
    return this.http.get<Account>(endpoint);
  }

  /****************** End Accounts Requests **********************/
  /****************** Begin Team Requests ************************/
  getTeams(): Observable<Team[]> {
    let endpoint = this._url + '/api/team';
    return this.http.get<Team[]>(endpoint);
  }

  getTeam(id: number): Observable<Team> {
    let endpoint = this._url + '/api/team/' + id;
    return this.http.get<Team>(endpoint);
  }

  addTeam(name: string, description: string): Observable<Team> {
    let endpoint = this._url + '/api/team';
    let body = {
      ownerId: this.accountService.account.ownerId,
      teamName: name,
      teamDescription: description
    };
    return this.http.post<Team>(endpoint, body);
  }

  editTeam(team: Team) {
    let endpoint = this._url + '/api/team/' + team.ownerId + '/' + team.id;
    let json = {
      id: team.id,
      ownerId: team.ownerId,
      teamDescription: team.teamDescription,
      teamName: team.teamName
    };
    return this.http.put(endpoint, json, { responseType: 'json' });
  }

  getTeamMembers(id: number): Observable<Account[]> {
    let endpoint = this._url + '/api/team/members/' + id;
    return this.http.get<Account[]>(endpoint);
  }

  inviteToTeam(userId: number, ownerId: number, teamid: number) {
    let endpoint =
      this._url + '/api/team/invite/' + userId + '/' + ownerId + '/' + teamid;
    let body = '';
    return this.http.put(endpoint, body);
  }

  deleteTeam(ownerId: number, teamId: number) {
    let endpoint =
      this._url + '/api/team/invite/' + '/' + ownerId + '/' + teamId;
  }

  getInvites(ownerId: number) {
    let endpoint = this._url + '/api/team/invite/outgoing' + '/' + ownerId;
    return this.http.get<any>(endpoint);
  }

  /****************** End Team Requests **************************/
  /****************** Begin Task Requests ************************/
  getuserTodo(userId: number): Observable<Task[]> {
    let endpoint = this._url + '/api/tasks/todo/' + userId;
    return this.http.get<Task[]>(endpoint);
  }
  /****************** End Task Requests **************************/
}
