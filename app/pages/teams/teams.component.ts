import { Component, OnInit } from '@angular/core';
import { team } from '~/shared/teams/team';
import { Observable } from 'rxjs';

@Component({
  selector: 'teams',
  moduleId: module.id,
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
    
})

export class TeamsComponent implements OnInit {
  public teams$: Observable<Array<team>>;

  ngOnInit(): void {
  //disclaimer, this is testing with dummy data
  this.teams$[0] = new team(0, 'team1', 'the first team');
  }
}