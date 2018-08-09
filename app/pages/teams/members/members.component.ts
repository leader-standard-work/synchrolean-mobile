import { Injectable, Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { TextField } from 'ui/text-field';
import { TeamService } from '~/shared/services/teams.service';

import { Account } from '~/shared/models/account';
import { Team } from '~/shared/models/team';
import * as dialogs from 'ui/dialogs';
import { AccountService } from '~/shared/services/account.service';
import { Task } from '~/shared/models/task';
import { ObservableInput } from 'rxjs';
import { Observable } from 'ui/page/page';
import { ObservableArray } from 'data/observable-array/observable-array';
import { ServerService } from '~/shared/services/server.service';
import { AuthenticationService } from '~/shared/services/auth.service';

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
  public team: Team; //holds team
  public teamName: string; //holds team name
  public teamDesc: string; //holds team description
  public members: ObservableArray<Account>; //Holds members of the team
  public tasks$: Array<ObservableArray<Task>>; //holds each team members tasks
  public teams$: Array<Team>; //holds teams for permissions
  public invites: Array<any>; //holds array of invite rousources
  public invitees: Array<Account>; //holds accounts for invited useres

  //permissions check
  public isOwner: Boolean;
  public isMember: boolean;

  //button presses
  public teamVisible: boolean;
  public taskVisible: Array<boolean>;
  public metericsVisible: boolean;
  public permissionVisible;
  public editHit: boolean;
  public inviteVisible: boolean;
  public editTeamNameHit: boolean;
  public editTeamDescHit: boolean;

  public length: number;

  private id: number;

  constructor(
    private serverService: ServerService,
    private authService: AuthenticationService,
    private teamService: TeamService,
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
    //Add 'implements OnInit' to the class

    this.members = new ObservableArray<Account>();
    this.tasks$ = new Array<ObservableArray<Task>>();
    this.invites = new Array<any>();
    this.invitees = new Array<Account>();
    this.teams$ = new Array<Team>();

    //permission intialized
    this.isOwner = false;
    this.isMember = false;

    //list visibilty with team being showed on page load
    this.teamVisible = true;
    this.taskVisible = new Array<boolean>(false);
    this.metericsVisible = false;
    this.inviteVisible = false;

    // Get team by id
    this.teamService.getTeam(this.id).subscribe(
      response => {
        this.teamName = response.teamName;
        this.teamDesc = response.teamDescription;
        this.team = response;
        // Get team members call
        this.teamService.getTeamMembers(this.id).subscribe(
          accounts => {
            accounts.forEach((account, index) => {
              // get each members todo list
              this.serverService
                .getuserTodo(account.ownerId)
                .subscribe(tasks => {
                  this.tasks$[index] = new ObservableArray<Task>();
                  tasks.forEach(task => {
                    this.tasks$[index].push(task);
                  });
                });
              this.members.push(account);
              this.taskVisible.push(false);

              //check the user is a member of the team
              if (account.ownerId === this.authService.userId) {
                this.isMember = true;

                //check if they are the owner
                this.isOwner =
                  this.team.ownerId === this.authService.userId ? true : false;
              }
            });
          },
          error => {
            console.error('could not get team members', error);
          }
        );
      },
      error => {
        console.error('could not load team in members', error);
        this.isOwner = false;
      }
    );
  }

  getTaskListLength(tasks: Task[]): number {
    if (tasks === undefined) return 0;

    return tasks.length;
  }

  //navigate to members task list taking id with it
  onTap(index: number) {
    if (this.taskVisible[index] === true) {
      this.taskVisible[index] = false;
      return;
    }

    this.taskVisible[index] = true;
  }

  addTapped() {
    dialogs
      .prompt({
        title: "Please enter the user's email",
        okButtonText: 'Send invite',
        cancelButtonText: 'Cancel',
        inputType: dialogs.inputType.email
      })
      .then(r => {
        //check result

        if (r.result !== false) {
          //make server call to add by email
          var user: Account;

          this.serverService.getAccountByEmail(r.text).subscribe(res => {
            user = res;
            console.log(user.ownerId);

            //SErver call to invite user to team
            this.serverService
              .inviteToTeam(user.ownerId, this.team.ownerId, this.team.id)
              .subscribe(
                res => {
                  console.log(res);

                  //dialog alert box to let the user know of success
                  dialogs
                    .alert({
                      title: 'Invite User',
                      message: 'User invited',
                      okButtonText: 'Ok'
                    })
                    .then();
                },
                err => {
                  console.error('Could not invite user', err);

                  //dialog alert box to let the user know of success
                  dialogs
                    .alert({
                      title: 'Invite User',
                      message: 'Could not invite user',
                      okButtonText: 'Ok'
                    })
                    .then();
                }
              );
          });
        }
      });
  }

  teamTapped() {
    //if team is already visible just leave
    if (this.teamVisible === true) {
      return;
    }

    this.tasks$ = new Array<ObservableArray<Task>>();
    this.members = new ObservableArray<Account>();
    // Get team members call
    this.serverService.getTeamMembers(this.id).subscribe(
      accounts => {
        accounts.forEach(
          (account, index) => {
            //get each members todo list
            this.serverService.getuserTodo(account.ownerId).subscribe(tasks => {
              this.tasks$[index] = new ObservableArray<Task>();
              tasks.forEach(task => {
                this.tasks$[index].push(task);
              });
            });
            this.members.push(account); // push account onto the component array
            this.taskVisible.push(false); //push false to array for visible members list
          },
          error => {
            console.error('could not get team members', error);
          }
        );
      },
      error => {
        console.error('could not load team in members', error);
      }
    );

    this.editHit = false;
    this.permissionVisible = false;
    this.inviteVisible = false;
    this.metericsVisible = false;
    this.teamVisible = true;
  }

  metricsTapped() {
    if (this.metericsVisible === true) {
      return;
    }

    this.teamVisible = false;
    this.metericsVisible = true;
    this.permissionVisible = false;
    this.editHit = false;
  }

  //controls the edit buttions showing by when the edit buttons is hit
  editTapped() {
    if (this.teamVisible === true) {
      if (this.editHit === false) {
        this.editHit = true;
      } else {
        this.editHit = false;
        this.editTeamDescHit = false;
        this.editTeamNameHit = false;
      }
    }

    this.inviteVisible = false;
    this.permissionVisible = false;
    this.metericsVisible = false;
    this.teamVisible = true;
    return;
  }

  //Controls if persmisson list is visible
  permissionsTapped() {
    if (this.permissionVisible === true) {
      return;
    }

    //make new team array
    this.teams$ = new Array<Team>();

    //get list of teams in organization
    this.serverService.getTeams().subscribe(
      res => {
        res.forEach(value => {
          this.teams$.push(value);
        });
      },
      err => {
        console.error('couldnt get teams from server', err);
      }
    );

    //make sure lists and buttons for edit are hidden
    this.inviteVisible = false;
    this.teamVisible = false;
    this.metericsVisible = false;
    this.permissionVisible = true;
    this.editHit = false;
  }

  invitesTapped() {
    //If invites is already visible go away
    if (this.inviteVisible === true) {
      return;
    }

    //make new arrays
    this.invites = new Array<any>();
    this.invitees = new Array<Account>();

    //get invite resources
    this.serverService.getInvites(this.team.ownerId).subscribe(
      res => {
        res.forEach(value => {
          this.invites.push(value);
        });

        //get accounts for invite
        this.invites.forEach(value => {
          this.serverService.getAccountById(value.inviteeId).subscribe(
            res => {
              //push invitee onto an accounts array
              //if they are for this team
              if (value.teamId === this.team.id) {
                this.invitees.push(res);
              }
            },
            err => {
              console.log('Error getting user info for invites', err);
            }
          );
        });
      },
      err => {
        console.error('Error getting invites', err);
      }
    );

    //make other list invisible
    this.teamVisible = false;
    this.metericsVisible = false;
    this.permissionVisible = false;
    this.inviteVisible = true;
    this.editHit = false;
  }

  //pass ownership to team member
  passOwner(id: number) {
    console.log(id);

    //check if it's beeing passed to the current owner
    if (id === this.team.ownerId) {
      dialogs
        .alert({
          title: 'This person is already the owner',
          okButtonText: 'Ok'
        })
        .then(function() {
          console.log('Dialog closed!');
        });
      return;
    }

    //holds old owner id
    var oldOwner = this.team.ownerId;
    this.team.ownerId = id;

    //server call to pass ownership
    this.serverService.passOwner(this.team, oldOwner).subscribe(
      rep => {
        console.log('Saved new owner');
        this.editHit = false;
        this.isOwner = false;

        //alert to change happen sucessfully
        dialogs
          .alert({
            title: 'Ownership changed',
            okButtonText: 'Ok'
          })
          .then(function() {
            console.log('Dialog closed!');
          });
      },
      err => {
        dialogs
          .alert({
            title: "Ownership couldn't be changed",
            okButtonText: 'Ok'
          })
          .then(function() {
            console.log('Dialog closed!');
          });
        console.log('Error editing team in change ownership\n', err);
      }
    );
  }

  //lets member leave team
  leaveTapped(ownerId: number) {
    //if the team owner is trying to leave don't let em
    if (ownerId === this.team.ownerId) {
      dialogs
        .alert({
          title: 'You cannot leave/remove the team owner',
          message: 'Pass ownership first',
          okButtonText: 'Ok'
        })
        .then(function() {
          console.log('Dialog closed!');
        });

      return;
    }

    //call to remove team member
    this.serverService.removeMember(ownerId, ownerId, this.team.id).subscribe(
      res => {
        console.log('Successfully remove');
        //navigate back to teams after leaving
        this.routerE.navigate(['/teams'], {
          transition: {
            name: 'slideRight'
          },
          clearHistory: true
        });
      },
      err => {
        console.error('Error removing member', err);
      }
    );
    console.log(ownerId);
  }

  deleteMember(callerId: number, targetId: number) {
    //if the target is the team owner that can't be let go
    if (targetId === this.team.ownerId) {
      dialogs
        .alert({
          title: 'You cannot leave/remove the team owner',
          message: 'Pass ownership first',
          okButtonText: 'Ok'
        })
        .then(function() {
          console.log('Dialog closed!');
        });

      return;
    }

    //call to remove member
    this.serverService.removeMember(callerId, targetId, this.team.id).subscribe(
      res => {
        console.log('Successfully remove');
        //after removing reload the list
        this.teamVisible = false;
        this.teamTapped();
      },
      err => {
        console.error('Error removing member', err);
      }
    );
    console.log(callerId + targetId);
  }

  //edit team name called
  editTeamName(name: string) {
    //if edit team name hit is already true save new data
    //then flip the textfield back to label
    if (this.editTeamNameHit === true) {
      this.editTeamNameHit = false;
      this.teamName = name;
      this.team.teamName = name;
      //call to edit team
      this.serverService.editTeam(this.team).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.error('Error updating the team in the server', err);
        }
      );
      return;
    }
    this.editTeamNameHit = true;
  }

  editTeamDesc(desc: string) {
    //if edit team description hit is already true save new data
    //then flip the textfield back to label
    if (this.editTeamDescHit === true) {
      this.editTeamDescHit = false;
      this.teamDesc = desc;
      this.team.teamDescription = desc;
      //call to edit team
      this.serverService.editTeam(this.team).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.error('Error updating the team in the server', err);
        }
      );
      return;
    }
    this.editTeamDescHit = true;
  }

  inviteeTapped() {}

  teamPermissionTapped() {}

  deleteTeam() {}
}
