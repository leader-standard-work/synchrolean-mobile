import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AccountService, State } from '../services/account.service';
import { Team } from '../models/team';

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

    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'json',
      withCredentials: true
    };
  }

  isLoggedIn(): boolean {
    if (this.accountService.state === State.LoggedIn) {
      return true;
    }
    return false;
  }

  /****************** Begin Accounts Requests ********************/
  login(email: String, password: string): boolean {
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
    let body = { FirstName: firstname, LastName: lastname, Email: email };
    this.http.post(serverUrl, body, this._httpOptions).subscribe(
      data => {
        console.log('Server Response: ', data);
      },
      error => {}
    );
    return false;
  }

  /****************** End Accounts Requests **********************/
  /****************** Begin Team Requests ************************/
  getTeams(): Array<Team> {
    let teams = new Array<Team>();

    return teams;
  }
  getTeam(id: number): Team {
    return null;
  }
  addTeam(id: number, team: Team) {}
  editTeam(team: Team) {}

  /****************** End Team Requests **************************/
  /****************** Begin Task Requests ************************/

  /****************** End Task Requests **************************/
}
