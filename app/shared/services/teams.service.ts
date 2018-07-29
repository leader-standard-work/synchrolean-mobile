import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ObservableArray } from 'data/observable-array';

import { Team } from '~/shared/models/team';
import { Account } from '~/shared/models/account';
import { ServerService } from '~/shared/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teams: Array<Team>;

  constructor(private serverService: ServerService) {
    this.teams = new Array<Team>();
  }
  //end of constructor
  public getTeams(): Observable<Team[]> {
    return this.serverService.getTeams();
  }

  public getTeam(id: number): Observable<Team> {
    return this.serverService.getTeam(id);
  }

  public addTeam(name: string, description: string): Observable<Team> {
    //incomplete, will add to global dummy data?
    return this.serverService.addTeam(name, description);
  }

  public getTeamMembers(id: number): Observable<Account[]> {
    return this.serverService.getTeamMembers(id);
  }

  //public updateTeam(){}

  //public deleteTeam(){}
}
