import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/teams/team';
import { Observable } from 'rxjs';
import { ServerService } from '~/shared/server/server.service';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: Array<Team>;

  constructor(
    private server: ServerService,
    private routerExtension: RouterExtensions
  ) {}

  ngOnInit(): void {
    //disclaimer, this is testing with dummy data
    this.server.getTeams().subscribe(
      teams => {
        this.teams$ = JSON.parse(JSON.stringify(teams));
      },
      err => {
        console.log(err);
      }
    );
  }

  tasksTapped() {
    this.routerExtension.navigate(['/task-list'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }
}
