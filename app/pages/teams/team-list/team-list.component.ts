import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/models/team';
import { ServerService } from '~/shared/services/server.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { teams } from '~/shared/dummyData';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams: Array<Team>;

  constructor(
    private serverService: ServerService,
    private routerExtensions: RouterExtensions
  ) {
    this.teams = new Array<Team>();
  }

  ngOnInit(): void {
    //disclaimer, this is testing with dummy data
    //this.teams$ = this.server.getTeams()

    // if(this.teams$ === undefined){
    this.teams = JSON.parse(teams);
    // }
  }

  onTap(id:number) {
    this.routerExtensions.navigate(['/Members', id], {
      transition: {
        name: 'slideLeft'
      }
    });
  }

  tasksTapped() {
    this.routerExtensions.navigate(['/task-list'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }

  metricsTapped() {
    this.routerExtensions.navigate(['/metrics'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }

  logoutTapped() {
    this.serverService.logout();
  }

  isLoggedIn(): boolean {
    return this.serverService.isLoggedIn();
  }
}
