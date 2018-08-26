//The notification page is for displaying notifications on things like pending team invites

import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { AuthenticationService } from '~/shared/services/auth.service';
import { AccountService } from '~/shared/services/account.service';
import { AddUserRequest } from '~/shared/models/AddUserRequest';
import { TeamService } from '~/shared/services/teams.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Team } from '~/shared/models/team';

@Component({
  selector: 'notifications',
  moduleId: module.id,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[]; //list of all invites a user has
  public pending: AddUserRequest[]; // list ofinvites a user has sent that are pending
  public teams: Team[];
  public teamsSubject: BehaviorSubject<Team[]>;
  public teamsObservable: Observable<Team[]>;
  public displayPeding = false;
  public inviterAccounts: Account[];
  public pendingAccounts: Account[];

  constructor(
    private authService: AuthenticationService,
    private teamService: TeamService,
    private routerExtensions: RouterExtensions
  ) {
    this.teams = new Array<Team>();
    this.teamsSubject = new BehaviorSubject([]);
    this.teamsObservable = this.teamsSubject.asObservable();
  }

  ngOnInit(): void {
    //grab the current pending invites to view
    if (this.authService.isLoggedIn()) {
      this.teamService.fetchTeamInvites().subscribe(
        invites => {
          this.invites = invites;
          this.invites.forEach(invite => {
            this.teamService.getTeam(invite.teamId).subscribe(
              response => {
                this.teams.push(response);
                this.teamsSubject.next(this.teams);
              },
              error => {
                console.error('get teams failed ', error);
              }
            );
          });
          //this.getInviterAccounts();
        },
        err => console.error('Failed to grab pending invites', err)
      );
    }
  }

  //accepts team invite and adds user to team
  acceptTeamInvite(teamId: number) {
    this.teamService
      .acceptTeamInvite(teamId)
      .subscribe(data => this.routerExtensions.navigate(['teams/' + teamId]));
  }

  //declines an invite to a team
  declineTeamInvite(teamId: number) {
    this.teamService
      .declineTeamInvite(teamId)
      .subscribe(data => this.routerExtensions.navigate(['teams/' + teamId]));
  }

  backToAccount(){
    this.routerExtensions.navigate(['/account'], {
      transition: {
        name: 'slideRight'
      },
      clearHistory: true
    });
  }
}
