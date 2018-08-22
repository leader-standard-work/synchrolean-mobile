//The notification page is for displaying notifications on things like pending team invites

import { Component, OnInit} from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { AuthenticationService } from '~/shared/services/auth.service';
import { AccountService } from '~/shared/services/account.service';
import { AddUserRequest } from '~/shared/models/AddUserRequest';
import { TeamService } from '~/shared/services/teams.service';

@Component({
  selector: 'notifications',
  moduleId: module.id,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

  export class NotificationsComponent implements OnInit {
    public invites: AddUserRequest[]; //list of all invites a user has 
    public pending: AddUserRequest[]; // list ofinvites a user has sent that are pending
    public displayPending = false;
    public inviterAccounts: Account[];
    public pendingAccounts: Account[];

    constructor( 
      private authService: AuthenticationService,
      private accountService: AccountService,
      private teamService: TeamService,
      private routerExtensions: RouterExtensions
    ){}

  ngOnInit(): void {
    //grab the current pending invites to view
    this.teamService.fetchTeamInvites().subscribe((invites) => {
        this.invites = invites;
        //this.getInviterAccounts();
    }, err => console.log("Failed to grab pending invites"));

    //get Created invites (if its even needed)?
  }

  //accepts team invite and adds user to team
  acceptTeamInvite(invite: AddUserRequest){
    this.teamService.acceptTeamInvite(invite.teamId)
      .subscribe(data => this.routerExtensions.navigate(['teams/' + invite.teamId]));
  }

  //declines an invite to a team 
  declineTeamInvite(invite: AddUserRequest){
      this.teamService.declineTeamInvite(invite.teamId)
        .subscribe(data => this.routerExtensions.navigate(['teams/' + invite.teamId]));
  }
}

