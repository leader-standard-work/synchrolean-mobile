import { Injectable, OnInit } from '@angular/core';

import { Team } from '~/shared/teams/team';
import { Observable, of } from 'rxjs';
import { ServerService } from '~/shared/server/server.service';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';


@Injectable({
  providedIn: 'root'
})

export class TeamService {
  private teams: Array<Team>;
  private serverService: ServerService;

  constructor(serverService: ServerService){
    this.serverService = serverService;
    this.teams = new Array<Team>();

  }
  //end of constructor

  public getTeams(team: Team){
    for(let value of this.teams){
      if(value.Id === team.Id){
          value.TeamName = team.TeamName;
          value.TeamDescription = team.TeamDescription;
      }
    }
  }
  public addTeam(team:Team){
    //incomplete, will add to global dummy data?
  }
  //public updateTeam(){}

  //public deleteTeam(){}
}