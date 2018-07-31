import { Injectable, Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';

import { TeamService } from '~/shared/services/teams.service';

import { Account } from '~/shared/models/account';
import { Team } from '~/shared/models/team';
import * as dialogs from 'ui/dialogs';
import { AccountService } from '~/shared/services/account.service';

@Injectable({
  providedIn: 'root'
})
//name component and the markup and stayle sheet
@Component({
  selector: 'Members',
  moduleId: module.id,
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  public team: Team;
  public members: Array<Account>;
  public teamName: string; //holds fake team name
  public teamDescription: string; //hold fake team description
  public isOwner: Boolean;
  private id: number;

  constructor(
    private teamService: TeamService,
    private accountService: AccountService,
    private pageR: PageRoute,
    private routerE: RouterExtensions
  ) {
    this.pageR.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.id = +params['id'];
      });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.members = new Array<Account>();
    // Get team by id
    this.teamService.getTeam(this.id).subscribe(
      response => {
        this.team = response;
        this.teamDescription = this.team.teamDescription;
        this.teamName = this.team.teamName;
        this.isOwner =
          this.team.ownerId === this.accountService.account.ownerId
            ? true
            : false;
      },
      error => {
        console.error('could not load team in members', error);
        this.isOwner = false;
      }
    );

    // Get team members call
    this.teamService.getTeamMembers(this.id).subscribe(
      accounts => {
        accounts.forEach(account => this.members.push(account));
      },
      error => {
        console.error('could not get team members', error);
      }
    );
  }

  //navigate to members task list taking id with it
  onTap(id: number) {
    this.routerE.navigate(['/members-tasks', id], {
      transition: {
        name: 'slideLeft'
      }
    });
  }

  addTapped() {
    dialogs.prompt({
        title: "Please enter the user's email",
        okButtonText: 'Send invite',
        cancelButtonText: 'Cancel',
        inputType: dialogs.inputType.email
      })
      .then(r => {
        //make server call to add by email
        console.log('Dialog result: ' + r.result + ', text: ' + r.text);
        //check result
        //promot if it was ok or not
      });
  }
}
