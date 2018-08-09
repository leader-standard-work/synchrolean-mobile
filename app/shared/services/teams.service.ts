import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '~/shared/models/team';
import { Account } from '~/shared/models/account';
import { AuthenticationService } from '~/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Array<Team>;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.teams = new Array<Team>();
  }

  /**
   * Get all the teams for the organization
   * @returns An Observable team array
   */
  public getTeams(): Observable<Team[]> {
    let endpoint = this.authService.url + '/api/team';
    return this.http.get<Team[]>(endpoint);
  }

  /**
   * Get team information by team id
   * @param id the id of the requested team
   * @returns an Observable team
   */
  public getTeam(id: number): Observable<Team> {
    let endpoint = this.authService.url + '/api/team/' + id;
    return this.http.get<Team>(endpoint);
  }

  /**
   * Adds a team to the organization
   * @param name the name of the team
   * @param description the description of the team
   * @return Observable<Team> the team created
   */
  public addTeam(name: string, description: string): Observable<Team> {
    let endpoint = this.authService.url + '/api/team';
    let team = new Team();
    team.ownerId = this.authService.userId;
    team.teamName = name;
    team.teamDescription = description;
    return this.http.post<Team>(endpoint, team);
  }

  /**
   * Get all the accounts of team members
   * @param id the team id
   * @returns Observable<Account[]> an observable of the account array
   */
  public getTeamMembers(id: number): Observable<Account[]> {
    let endpoint = this.authService.url + '/api/team/members/' + id;
    return this.http.get<Account[]>(endpoint);
  }

  //public updateTeam(){}

  //public deleteTeam(){}
}
