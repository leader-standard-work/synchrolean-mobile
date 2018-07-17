import { Component, OnInit } from '@angular/core';
import { team } from '~/shared/teams/team';
import { Observable } from 'rxjs';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: Array<team>;


  ngOnInit(): void {
    //disclaimer, this is testing with dummy data
    this.teams$ = new Array();
    this.teams$.push(new team(0, 'team1', 'the first team'));
    this.teams$.push(new team(1, 'team2', 'the second team'));
  }
}
