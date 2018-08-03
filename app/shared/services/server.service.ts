import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService, State } from '~/shared/services/account.service';

import { Team, TeamServerInterface } from '~/shared/models/team';
import { Account, AccountServerInterface } from '~/shared/models/account';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private _url: string;
  private _httpOptions;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    if (accountService.state === State.LoggedIn) {
      this._url = this.accountService.serverUrl;
    } else {
      this._url = '';
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

  /****************** Begin Accounts Requests ********************/
  isLoggedIn(): boolean {
    if (this.accountService.state === State.LoggedIn) {
      return true;
    }
    return false;  
  }

  login(
    serverUrl: string,
    email: String,
    password: string
  ): Observable<Account> {
    this._url = serverUrl;
    let endpoint = this._url + '/api/accounts/' + email;
    // let body = { email: email, password: password };
    return this.http
      .get<AccountServerInterface>(endpoint)
      .pipe(map(response => new Account(response)));
  }

  // autoLogin(){
  //   this.accountService.state = 0;
  // }

  logout() {
    this._url = '';
    this.accountService.logout();
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
    let body = { firstName: firstname, lastName: lastname, email: email };
    return this.http
      .post<AccountServerInterface>(endpoint, body)
      .pipe(map(response => new Account(response)));
  }

  getAccountByEmail(email:string):Observable<Account>{
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

  inviteToTeam(userId: number, ownerId:number, teamid:number){
    let endpoint = this._url +'/api/team/invite/'+ userId +'/'+ownerId+'/'+teamid;
    let body ;
    return this.http.put(endpoint, body);
  }

  /****************** End Team Requests **************************/
  /****************** Begin Task Requests ************************/

  /****************** End Task Requests **************************/
}
