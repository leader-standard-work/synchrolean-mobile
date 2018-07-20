import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/teams/team';
import { Observable } from 'rxjs';
import { ServerService } from '~/shared/server/server.service';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: Array<Team>;

  constructor(private server:ServerService){

  }

  ngOnInit(): void {
    //disclaimer, this is testing with dummy data
    this.server.getTeams().subscribe(
      teams => {this.teams$ = JSON.parse(JSON.stringify(teams))}, 
      err => {console.log(err);} );
    }

}
