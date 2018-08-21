import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '~/shared/models/team';
import { Account } from '~/shared/models/account';
import { AuthenticationService } from '~/shared/services/auth.service';
import {AddUserRequest } from '~/shared/models/AddUserRequest';

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
    let endpoint = this.authService.url + '/api/teams';
    return this.http.get<Team[]>(endpoint);
  }

  /**
   * Get team information by team id
   * @param id the id of the requested team
   * @returns an Observable team
   */
  public getTeam(id: number): Observable<Team> {
    let endpoint = this.authService.url + '/api/teams/' + id;
    return this.http.get<Team>(endpoint);
  }

  /**
   * Adds a team to the organization
   * @param name the name of the team
   * @param description the description of the team
   * @return Observable<Team> the team created
   */
  public addTeam(name: string, description: string): Observable<Team> {
    let endpoint = this.authService.url + '/api/teams';
    let team = new Team();
    team.teamName = name;
    team.teamDescription = description;
    team.ownerEmail = this.authService.email;
    return this.http.post<Team>(endpoint, team);
  }

  /**
   * Get all the accounts of team members
   * @param id the team id
   * @returns Observable<Account[]> an observable of the account array
   */
  public getTeamMembers(id: number): Observable<Account[]> {
    let endpoint = this.authService.url + '/api/teams/members/' + id;
    return this.http.get<Account[]>(endpoint);
  }

  editTeam(team: Team) {
    let endpoint = this.authService.url + '/api/teams/' + team.id;
    let json = {
      id: team.id,
      OwnerEmail: team.ownerEmail,
      teamDescription: team.teamDescription,
      teamName: team.teamName
    };
    return this.http.put(endpoint, json, { responseType: 'json' });
  }

  passOwner(team: Team) {
    let endpoint = this.authService.url + '/api/teams/' + team.id;
    let json = {
      id: team.id,
      OwnerEmail: team.ownerEmail,
      teamDescription: team.teamDescription,
      teamName: team.teamName
    };
    return this.http.put(endpoint, json, { responseType: 'json' });
  }

  deleteTeam(teamId: number) {
    let endpoint = this.authService.url + '/api/teams/delete/' + teamId;
    let body = '';
    return this.http.post(endpoint, body);
  }

  inviteToTeam(ownerEmail: string, teamid: number) {
    let endpoint =
      this.authService.url + '/api/teams/invite/' + teamid + '/' + ownerEmail;
    let body = '';
    return this.http.put(endpoint, body);
  }

  removeMember(teamId: number, targetEmail: string) {
    let endpoint =
      this.authService.url + '/api/teams/remove/' + teamId + '/' + targetEmail;
    let body = '';
    return this.http.put(endpoint, body);
  }

  getInvites() {
    let endpoint = this.authService.url + '/api/teams/invite/outgoing';
    return this.http.get<any>(endpoint);
  }

  getAuthInvites() {
    let endpoint =
      this.authService.url + '/api/teams/invite/incoming/authorize';
    return this.http.get<any>(endpoint);
  }

  recindInvite(teamId: number, inviteeEmail: string) {
    let endpoint =
      this.authService.url +
      '/api/teams/invite/rescind/' +
      teamId +
      '/' +
      inviteeEmail;
    let body = '';
    return this.http.put(endpoint, body);
  }

  authorizeInvite(teamId: number, inviteeEmail: string) {
    let endpoint =
      this.authService.url +
      '/api/teams/invite/authorize/' +
      teamId +
      '/' +
      inviteeEmail;
    let body = '';
    return this.http.put(endpoint, body);
  }

  vetoInvite(teamId: number, inviteeEmail: string) {
    let endpoint =
      this.authService.url +
      '/api/teams/invite/veto/' +
      teamId +
      '/' +
      inviteeEmail;
    let body = '';
    return this.http.put(endpoint, body);
  }

  getTeamPermissions(teamId:number){
    let endpoint = this.authService.url + '/api/teams/permissions/team/' + teamId;
    return this.http.get<boolean>(endpoint);
  }

  permitTeam(objectId: number, subjectId: number) {
    let endpoint =
      this.authService.url +
      '/api/teams/permissions/grant/' +
      objectId +
      '/' +
      subjectId;
    let body = '';
    return this.http.put(endpoint, body);
  }

  forbidTeam(objectId: number, subjectId: number) {
    let endpoint =
      this.authService.url +
      '/api/teams/permissions/revoke/' +
      objectId +
      '/' +
      subjectId;
    let body = '';
    return this.http.put(endpoint, body);
  }

  //Fetches all outstanding team invites awaiting a user's input.
  fetchTeamInvites(): Observable<AddUserRequest[]> {
    let endpoint =
      this.authService.url+'/api/teams/invite/incoming/accept/';
    return this.http.get<AddUserRequest[]>(endpoint);    
  }

  //Accepts an invite to a team, adding the invitee to the team
  acceptTeamInvite(teamId: number): Observable<any> {
    let endpoint =
      this.authService.url+'/api/teams/invite/accept/' + teamId;
    return this.http.put(endpoint, null);
  }

  //Declines an invite to a team. 
  declineTeamInvite(teamId: number): Observable<any> {
    let endpoint = 
      this.authService.url+'/api/teams/invite/reject/' + teamId;
    return this.http.put(endpoint, null);
  }

}
