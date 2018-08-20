import { Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { TeamService } from '~/shared/services/teams.service';

import { Account } from '~/shared/models/account';
import { Team } from '~/shared/models/team';
import * as dialogs from 'ui/dialogs';
import { Task } from '~/shared/models/task';
import { ObservableArray } from 'data/observable-array/observable-array';
import { AuthenticationService } from '~/shared/services/auth.service';
import { TaskService } from '~/shared/services/tasks.service';
import { AccountService } from '~/shared/services/account.service';
import { SearchBar } from "ui/search-bar";


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
  public members: Array<Account>; //Holds members of the team
  public tasks$: Array<Array<Task>>; //holds each team members tasks
  public teams$: Array<Team>; //holds teams for permissions
  public invites: Array<any>; //holds array of invite rousources
  public invitees: Array<Account>; //holds accounts for invited users
  public authInvites: Array<Account>;
  public permittedTeams:Array<Team>;
  public searchPhrase: string;
  public searchMembers: Array<Account>;

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
  public addMember:boolean;

  public length: number;

  private id: number;

  constructor(
    private accountService: AccountService,
    private authService: AuthenticationService,
    private teamService: TeamService,
    private pageR: PageRoute,
    private taskService: TaskService,
    private routerE: RouterExtensions
  ) {
    this.pageR.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.id = +params['id'];
      });
  }

  onSubmit(args) {
    let searchBar = <SearchBar>args.object;
    let searchValue = searchBar.text.toLowerCase();

    this.searchMembers = new Array<Account>();
    if(searchValue !== ""){
      for(let i = 0; i < this.members.length; ++i){
        if(this.members[i].lastName.toLowerCase().indexOf(searchValue) !== -1){
          this.searchMembers.push(this.members[i])
        }
      }
    }
  }

  onClear(args) {
    let searchBar = <SearchBar>args.object;
    searchBar.text = "";
    searchBar.hint = "Member search by last name";
    this.searchMembers = new Array<Account>();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class

    this.members = new Array<Account>();
    this.tasks$ = new Array<Array<Task>>();
    this.invites = new Array<any>();
    this.invitees = new Array<Account>();
    this.teams$ = new Array<Team>();
    this.permittedTeams = new Array<Team>();
    this.authInvites = new Array<Account>();

    //permission intialized
    this.isOwner = false;
    this.isMember = false;

    //list visibilty with team being showed on page load
    this.teamVisible = true;
    this.taskVisible = new Array<boolean>(false);
    this.metericsVisible = false;
    this.inviteVisible = false;
    this.editHit = false;
    this.addMember = false;

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
              this.taskService
                .getuserTodo(account.email)
                .subscribe(tasks => {
                  this.tasks$[index] = new Array<Task>();
                  tasks.forEach(task => {
                    this.tasks$[index].push(task);
                  });
                });
              this.members.push(account);
              this.taskVisible.push(false);

              //check the user is a member of the team
              if (account.email === this.authService.email) {
                this.isMember = true;
                this.addMember = true;

                //check if they are the owner
                this.isOwner =
                  this.team.ownerEmail === this.authService.email ? true : false;
              }
            });
            if(!this.isMember){
              this.teamService.getTeamPermissions(this.team.id)
              .subscribe(res=>{
                this.isMember = res
              },err=>{
                console.log('Could not get permitted teams!');
              });
            }
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

    //check team permissions
 
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
            //SErver call to invite user to team
          this.teamService
            .inviteToTeam(r.text, this.team.id)
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
                  if(this.inviteVisible){
                    this.inviteVisible = false;
                    this.invitesTapped();
                  }
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
              });      
        }
      });
  }

  teamTapped() {
    //if team is already visible just leave
    if (this.teamVisible === true) {
      return;
    }

    this.tasks$ = new Array<Array<Task>>();
    this.members = new Array<Account>();
    // Get team members call
    this.teamService.getTeamMembers(this.id).subscribe(
      accounts => {
        accounts.forEach(
          (account, index) => {
            //get each members todo list
            this.taskService.getuserTodo(account.email).subscribe(tasks => {
              this.tasks$[index] = new Array<Task>();
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
    this.inviteVisible = false;
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
    this.teamService.getTeams().subscribe(
      res => {
        res.forEach(value => {
          if(value.id != this.team.id)
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
    this.teamService.getInvites().subscribe(
      res => {
        res.forEach(value => {
          this.invites.push(value);
        });

        //get accounts for invite
        this.invites.forEach(value => {
          this.accountService.getAccountByEmail(value.inviteeEmail).subscribe(
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

    this.teamService.getAuthInvites().subscribe(
      res => {
        this.invites = new Array<any>();
        this.authInvites = new Array<Account>();
        res.forEach(value => {
          this.invites.push(value);
        });

        //get accounts for invite
        this.invites.forEach(value => {
          this.accountService.getAccountByEmail(value.inviteeEmail).subscribe(
            res => {
              //push invitee onto an accounts array
              //if they are for this team
              if (value.teamId === this.team.id) {
                this.authInvites.push(res);
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
  passOwner(index: number) {
    //check if it's beeing passed to the current owner
    if (this.members[index].email == this.team.ownerEmail) {
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

    dialogs.confirm({
      title: "Are you sure?",
      message: "Are you sure you want to pass ownership to "+ this.members[index].firstName  + ' ' + this.members[index].lastName +"?",
      okButtonText: "Yes",
      cancelButtonText: "No",
    }).then(res=>{
      if(res){
        this.team.ownerEmail = this.members[index].email;

        //server call to pass ownership
        this.teamService.passOwner(this.team).subscribe(
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
          });
      }
    });
    
  }

  //lets member leave team
  leaveTapped() {
    //if the team owner is trying to leave don't let em
    const email = this.authService.email
    if (email === this.team.ownerEmail && this.members.length > 1) {
      dialogs
        .alert({
          title: 'WARNING',
          message: 'Leaving as the owner will pass leadership to a randon member',
          okButtonText: 'Ok'
        })
        .then(function() {
          console.log('Dialog closed!');
        });
    }


    dialogs.confirm({
      title: "Are you sure?",
      message: "Are you sure you want to leave "+ this.team.teamName +"?",
      okButtonText: "Yes",
      cancelButtonText: "No",
      cancelable: true
    }).then(result=>{
      if(result){
        //call to remove team member
        this.teamService.removeMember(this.team.id, this.authService.email).subscribe(
          res => {
            console.log('Successfully Left');
            //navigate back to teams after leaving
            this.routerE.navigate(['/teams'], {
              transition: {
                name: 'slideRight'
              },
              clearHistory: true
            });
          },
          err => {
            if(this.members.length === 1){          
              console.log('Successfully Left', err);
              dialogs.alert({
                title: "You have left and deleted " + this.team.teamName,
                okButtonText: "Ok",
              }).then(res=>{
                
              }); 
              this.routerE.navigate(['/teams'], {
                transition: {
                  name: 'slideRight'
                },
                clearHistory: true
              });
            }else{
              console.log('could not leave team');
              dialogs.alert({
                title: "Could not remove leave",
                okButtonText: "Ok",
              }).then(res=>{
                
              });
            }
          }
        );
      }
    });
  }

  deleteMember(index:number) {
    //if the target is the team owner that can't be let go
    if (this.members[index].email === this.team.ownerEmail && this.members.length > 1) {
      dialogs
        .alert({
          title: 'WARNING',
          message: 'deleting the owner will pass onwership to a random member',
          okButtonText: 'Ok'
        })
        .then(function() {
          console.log('Dialog closed!');
        });
    }

    
    dialogs.confirm({
      title: "Are you sure?",
      message: "Are you sure you want to delete " + this.members[index].firstName +' ' + this.members[index].lastName,
      okButtonText: "Yes",
      cancelButtonText: "No",
      cancelable: true
    }).then(result=>{
      if(result){
        //call to remove member
        this.teamService.removeMember(this.team.id,this.members[index].email)
        .subscribe(res => {
          dialogs.alert({
            title: "They were removed from the team",
            okButtonText: "Ok",
          }).then(res=>{});
            this.teamTapped();
        },
        err => {
          if(this.members.length === 1){          
            console.log('Successfully Left', err);
            dialogs.alert({
              title: "You have left and deleted " + this.team.teamName,
              okButtonText: "Ok",
            }).then(res=>{
              
            }); 
            this.routerE.navigate(['/teams'], {
              transition: {
                name: 'slideRight'
              },
              clearHistory: true
            });
          }else{
            console.log('could not leave team')
          
            dialogs.alert({
              title: "Could not remove team member",
              okButtonText: "Ok",
            }).then(res=>{
              
            });
          }
        }
        );
      }
    });
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
      this.teamService.editTeam(this.team).subscribe(
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
      this.teamService.editTeam(this.team).subscribe(
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

  inviteeTapped(index :number) {
    dialogs.confirm({
      title: "Are you sure?",
      message: "Are you sure you weant to recind the invite to " + this.invitees[index].firstName +' ' + this.invitees[index].lastName,
      okButtonText: "Yes",
      cancelButtonText: "No",
      cancelable: true
    }).then(result=>{
      if(result){
       this.teamService.recindInvite(this.team.id, this.invitees[index].email)
       .subscribe(res=>{
        dialogs.alert({
          title: "The invite was rescind",
          okButtonText: "Ok",
        }).then(res=>{
          this.inviteVisible = false;
          this.invitesTapped();
        });
       },err=>{
        dialogs.alert({
          title: "Could not rescind invite",
          okButtonText: "Ok",
        }).then();
       })
      }
    })
  }

  authTapped(index :number) {
    dialogs.confirm({
      title: "Are you sure?",
      message: "What would you like to do with invite?",
      okButtonText: "Authorize",
      cancelButtonText: "Veto",
      neutralButtonText:"Cancel",
      cancelable: true
    }).then(result=>{
      if(result === undefined){
        return;
      }
      if(result === true){
       this.teamService.authorizeInvite(this.team.id, this.authInvites[index].email)
       .subscribe(res=>{
        dialogs.alert({
          title: "Invite authorized",
          okButtonText: "Ok",
        }).then(res=>{
          this.inviteVisible = false;
          this.invitesTapped();
        });
       },err=>{
        dialogs.alert({
          title: "Could not authorize invite",
          okButtonText: "Ok",
        }).then();
       });
      }
      if(result === false){
        this.teamService.vetoInvite(this.team.id, this.authInvites[index].email)
        .subscribe(res=>{
          dialogs.alert({
            title: "Invite vetoed",
            okButtonText: "Ok",
          }).then(res=>{
            this.inviteVisible = false;
            this.invitesTapped();
          });
        },err=>{
          dialogs.alert({
            title: "Could not veto invite",
            okButtonText: "Ok",
          }).then();
        });
      }
 
    });
  }

  teamPermissionTapped(teamToTarget:Team) {
    let num = this.permittedTeams.findIndex((value)=>{
      return teamToTarget.id === value.id;
    });

    if(num > -1){
      dialogs
      .confirm({
        title: "Permissions",
        message:"Would you like to REJECT permission to view you team from this team?",
        okButtonText:'Yes',
        cancelButtonText:'No'
      }).then(r=>{
          if(r){
            this.teamService.forbidTeam(this.team.id, teamToTarget.id)
            .subscribe(res=>{
              dialogs.alert({
                title: "Team Permissions",
                message: "Team"+ teamToTarget.teamName +" DENIED permission to view " + this.team.teamName,
                okButtonText:'ok',
              }).then();
            },err=>{
              dialogs.alert({
                title: "Team Permissions",
                message: "Could not DENY viewing rights to " + teamToTarget.teamName,
                okButtonText:'ok',
              }).then();
            });
          }
      });
    }else{
      dialogs
      .confirm({
        title: "Permissions",
        message:"Would you like to GRANT permission to view you team from this team?",
        okButtonText:'Yes',
        cancelButtonText:'No'
      }).then(r=>{
          if(r){
            this.teamService.permitTeam(this.team.id, teamToTarget.id)
            .subscribe(res=>{
              dialogs.alert({
                title: "Team Permissions",
                message: "Team"+ teamToTarget.teamName +" GRANTED permission to view " + this.team.teamName,
                okButtonText:'ok',
              }).then();
            },err=>{
              console.log(err);
              dialogs.alert({
                title: "Team Permissions",
                message: "Could not GRANT viewing rights to " + teamToTarget.teamName,
                okButtonText:'ok',
              }).then();
            });
          }
      });
    }
  }

  deleteTeam() {
    dialogs.confirm({
      title: "Deleting Team",
      message: "Are you sure you want to delete this team?",
      okButtonText: "Yes",
      cancelButtonText: "No",
    }).then(res=>{
      if(res){
        this.teamService.deleteTeam(this.team.id)
        .subscribe(res=>{
            dialogs
            .alert( {         
              title: 'Team deleted',
              message: this.team.teamName+' has been deleted',
              okButtonText: 'Ok'})
            .then(function(){

            });
            
            this.routerE.navigate(['/teams'], {
              transition: {
                name: 'slideLeft'
              },
              clearHistory: true
            });
            
        },err=>{
          console.log(err);
          dialogs
          .alert( {         
            title: 'Could not deleted team',
            message: 'The team could not be deleted',
            okButtonText: 'Ok'})
          .then(function(){
            
          });  
      });
      }
    },err=>{

    });
  }
}
