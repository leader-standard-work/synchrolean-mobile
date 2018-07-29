import { Injectable, OnInit } from '@angular/core';

import { Team } from '~/shared/models/team';
import { Observable, of } from 'rxjs';
import { ServerService } from '~/shared/services/server.service';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

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

  //public updateTeam(){}

  //public deleteTeam(){}
}
