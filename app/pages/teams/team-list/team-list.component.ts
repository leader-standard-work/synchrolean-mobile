import { Component, OnInit } from '@angular/core';
import { Team } from '~/shared/models/team';
import { ServerService } from '~/shared/services/server.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { ObservableArray } from 'data/observable-array';
import { AccountService } from '~/shared/services/account.service';
import { AuthenticationService } from '~/shared/services/auth.service';
import { TeamService } from '~/shared/services/teams.service';
import { SearchBar } from "ui/search-bar";

@Component({
  selector: 'team-list',
  moduleId: module.id,
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  public teams$: ObservableArray<Team>;
  public searchPhrase: string;
  public searchTeams: ObservableArray<Team>;

  constructor(
    private teamService: TeamService,
    private authService: AuthenticationService,
    private routerExtensions: RouterExtensions,
  ) {}

  onSubmit(args) {
    let searchBar = <SearchBar>args.object;
    let searchValue = searchBar.text.toLowerCase();

    this.searchTeams = new ObservableArray<Team>();
    if(searchValue !== ""){
      for(let i = 0; i < this.teams$.length; ++i){
        if(this.teams$.getItem(i).teamName.toLowerCase().indexOf(searchValue) !== -1){
          this.searchTeams.push(this.teams$.getItem(i))
        }
      }
    }
  }

  onClear(args) {
    let searchBar = <SearchBar>args.object;
    searchBar.text = "";
    searchBar.hint = "Team search";
    this.searchTeams = new ObservableArray<Team>();
  }

  ngOnInit() {
    this.teams$ = new ObservableArray<Team>();

    if (this.authService.isLoggedIn()) {
      this.teamService.getTeams().subscribe(
        teams => {
          teams.forEach(team => this.teams$.push(team));
          console.log(teams);
        },
        error => {
          console.error('could not get teams', error);
        }
      );
    } else {
      this.routerExtensions.navigate(['/login'], {
        transition: {
          name: 'slideTop'
        },
        clearHistory: true
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onTap(id: number) {
    this.routerExtensions.navigate(['/Members', id], {
      transition: {
        name: 'slideLeft'
      }
    });
  }

  logoutTapped() {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      this.teams$ = new ObservableArray<Team>();
      this.routerExtensions.navigate(['/login'], {
        clearHistory: true,
        transition: {
          name: 'slideTop'
        }
      });
    }
  }

  tasksTapped() {
    this.routerExtensions.navigate(['/task-list'], {
      clearHistory: true,
      animated: false
    });
  }

  metricsTapped() {
    this.routerExtensions.navigate(['/metrics'], {
      clearHistory: true,
      animated: false
    });
  }
}
