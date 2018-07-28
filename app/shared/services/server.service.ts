import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountService, State } from '~/shared/services/account.service';
import { Team, TeamServerInterface } from '~/shared/models/team';
import { Account, AccountServerInterface } from '~/shared/models/account';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private _url: string;
  private _taskApi: string;
  private _teamApi: string;
  private _accountApi: string;
  private _httpOptions;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    if (accountService.state === State.LoggedIn) {
      this._url = this.accountService.serverUrl;
      this._taskApi = this._url + '/tasks/';
      this._teamApi = this._url + '/teams/';
      this._accountApi = this._url + '/accounts/';
    } else {
      this._url = '';
      this._taskApi = '';
      this._teamApi = '';
    }

    // this._httpOptions =  {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   }),
    //   observe: 'body',
    //   responseType: 'json',
    //   withCredentials: true
    // };
  }

  set serverUrl(url: string) {
    this._url = url;
    this._taskApi = this._url + '/api/tasks/';
    this._teamApi = this._url + '/api/teams/';
    this._accountApi = this._url + '/api/accounts/';
  }

  /****************** Begin Accounts Requests ********************/
  isLoggedIn(): boolean {
    if (this.accountService.state === State.LoggedIn) {
      return true;
    }
    return false;
  }

  login(serverUrl: string, email: String, password: string): boolean {
    this.serverUrl = serverUrl;
    let body = { email: email, password: password };
    // Authentication here!

    return false;
  }

  logout() {
    this._url = '';
    this._taskApi = '';
    this._teamApi = '';
    this.accountService.logout();
  }

  register(
    serverUrl: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): boolean {
    this.serverUrl = serverUrl;
    let body = { firstName: firstname, lastName: lastname, email: email };
    this.http.post<AccountServerInterface>(this._accountApi, body).subscribe(
      response => {
        this.accountService.account = new Account(response);
        console.log(this.accountService.account);
      },
      error => {
        console.log('error on registering user', error);
      }
    );
    return false;
  }

  /****************** End Accounts Requests **********************/
  /****************** Begin Team Requests ************************/
  getTeams(): Array<Team> {
    let endpoint = this._url + '/api/team';
    let teams = new Array<Team>();
    this.http.get<TeamServerInterface>(endpoint).subscribe(
      response => {
        teams.push(new Team(response));
      },
      error => {}
    );

    return teams;
  }
  getTeam(id: number): Team {
    return null;
  }
  addTeam(name: string, description: string) {
    let endpoint = this._url + '/api/team';
    let body = {
      ownerId: this.accountService.account.ownerId,
      teamName: name,
      teamDescription: description
    };
    this.http.post(endpoint, body).subscribe(response => {}, error => {});
  }
  editTeam(team: Team) {}

  /****************** End Team Requests **************************/
  /****************** Begin Task Requests ************************/

  /****************** End Task Requests **************************/
}
