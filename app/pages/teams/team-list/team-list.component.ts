import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/models/team';
import { ServerService } from '~/shared/services/server.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { ObservableArray } from 'data/observable-array';
import { teams } from '~/shared/dummyData';

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: ObservableArray<Team>;
  public loginButtonText: string;

  constructor(
    private serverService: ServerService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit() {
    this.teams$ = new ObservableArray<Team>();
    if (this.serverService.isLoggedIn()) {
      this.loginButtonText = 'Logout';
      this.serverService.getTeams().subscribe(
        teams => {
          teams.forEach(team => this.teams$.push(team));
          console.log(teams);
        },
        error => {
          console.error('could not get teams', error);
        }
      );
    } else {
      this.loginButtonText = 'Sign in';
    }
  }

  isLoggedIn(): boolean {
    return this.serverService.isLoggedIn();
  }

  onTap(id: number) {
    this.routerExtensions.navigate(['/Members', id], {
      transition: {
        name: 'slideLeft'
      }
    });
  }

  loginTapped() {
    if (this.serverService.isLoggedIn()) {
      this.serverService.logout();
      this.loginButtonText = 'Sign In';
      this.routerExtensions.navigate(['/teams'], {
        transition: {
          name: 'slideTop'
        }
      });
    } else {
      this.routerExtensions.navigate(['/login'], {
        transition: {
          name: 'slideTop'
        }
      });
    }
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
}
