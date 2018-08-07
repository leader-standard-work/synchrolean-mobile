import { Injectable, Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { TextField } from "ui/text-field";
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
  public team: Team;                                //holds team
  public teamName: string;                          //holds team name
  public teamDesc: string;                          //holds team description
  public members: ObservableArray<Account>;         //Holds members of the team
  public tasks$:  Array<ObservableArray<Task>>;     //holds each team members tasks
  public teams$:  Array<Team>;            //holds teams for permissions
  public invites: Array<any>;
  public invitees: Array<Account>;

  //permissions check
  public isOwner: Boolean;
  public isMember:boolean;

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
    //Add 'implements OnInit' to the class

    this.members = new ObservableArray<Account>();
    this.tasks$ = new Array<ObservableArray<Task>>();
    this.invites = new Array<any>();
    this.invitees = new Array<Account>();
    this.teams$ = new Array<Team>();

    //permission intialized
    this.isOwner = false;
    this.isMember =false;
    
    //list visibilty with team being showed on page load
    this.teamVisible = true;    
    this.taskVisible = new Array<boolean>(false);
    this.metericsVisible=false;
    this.inviteVisible = false;

    // Get team by id
    this.serverService.getTeam(this.id).subscribe(
      response => {
        this.teamName = response.teamName;
        this.teamDesc = response.teamDescription;
        this.team = response;
        // Get team members call
        this.serverService.getTeamMembers(this.id).subscribe(
          accounts => {
            accounts.forEach((account, index) => {
              //get each members todo list
              this.serverService.getuserTodo(account.ownerId)
                .subscribe(tasks =>{
                  this.tasks$[index] = new ObservableArray<Task>();
                  tasks.forEach(task=>{
                    this.tasks$[index].push(task);
                  });
                });
              this.members.push(account);
              this.taskVisible.push(false); 
              
              //check the user is a member of the team
              if(account.ownerId === this.accountService.account.ownerId){
                this.isMember = true;
  
                //check if they are the owner
                this.isOwner =
                this.team.ownerId === this.accountService.account.ownerId
                  ? true
                  : false;
              }

              //get invites
              if(this.isOwner === true){
                //get teams for permissions
                this.serverService.getTeams()
                .subscribe(res=>{
                  res.forEach((value)=>{ 
                    this.teams$.push(value);
                  });
                }, err=>{
                  console.error("couldnt get teams from server", err);
                });

                //get owner created invites
                this.serverService.getInvites(this.team.ownerId)
                  .subscribe(res=>{
                      res.forEach((value)=>{
                        this.invites.push(value);
                      });
          
                      //get accounts for invite
                      this.invites.forEach((value)=>{
                        this.serverService.getAccountById(value.inviteeId)
                          .subscribe(res=>{
                            //push invitee onto an accounts array
                            //if they are for this team
                            if(value.teamId === this.team.id){
                              this.invitees.push(res);
                            }
                          },err=>{
                            console.log('Error getting user info for invites', err);
                          });
                      });
                  }, err=>{
                      console.error('Error getting invites', err);
                  });
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

    //get roll-up tasks for team
    
  }

  getTaskListLength(tasks: Task[]):number{
    if(tasks === undefined)
      return 0;

    return tasks.length;
  }

  //navigate to members task list taking id with it
  onTap(index: number) {
    if(this.taskVisible[index] === true){
      this.taskVisible[index] =false;
      return;
    }

    this.taskVisible[index] = true;
  }

  addTapped() {
    dialogs.prompt({
        title: "Please enter the user's email",
        okButtonText: 'Send invite',
        cancelButtonText: 'Cancel',
        inputType: dialogs.inputType.email
      })
      .then(r => {     
        //check result
     
        if(r.result !== false){
          //make server call to add by email
          var user:Account;
           
          this.serverService.getAccountByEmail(r.text).subscribe((res)=>{
            user = res;
            console.log(user.ownerId);
            this.serverService.inviteToTeam(user.ownerId, this.team.ownerId, this.team.id)
              .subscribe((res)=>{
                console.log(res);
                dialogs.alert({
                  title:'Invite User',
                  message:'User invited',
                  okButtonText:'Ok'
                }).then();
              }, err=>{
                console.log(res);
                dialogs.alert({
                  title:'Invite User',
                  message:'User invited',
                  okButtonText:'Ok'
                }).then();
              }); 
          });
          console.log('Dialog result: ' + r.result + ', text: ' + r.text);
          //check result
          //promot if it was ok or not
        }                
      });
  }

  teamTapped(){
    if(this.teamVisible === true){
      return;
    }

    this.editHit = false;
    this.permissionVisible = false;
    this.inviteVisible = false;
    this.metericsVisible = false;
    this.teamVisible = true;
  }

  metricsTapped(){
    if(this.metericsVisible === true){ 
      return;
    }

    this.teamVisible = false;
    this.metericsVisible = true;
    this.permissionVisible = false;
    this.editHit = false;
  }

  editTapped(){
    if(this.teamVisible === true){
      if(this.editHit === false){
         this.editHit = true;
      }
      else{ 
        this.editHit = false;
        this.editTeamDescHit =false;
        this.editTeamNameHit = false;
      }
    }

    this.inviteVisible = false;
    this.permissionVisible = false;
    this.metericsVisible = false;
    this.teamVisible = true;
    return;
  }

  permissionsTapped(){
      if(this.permissionVisible === true){
        return;
      }

      this.inviteVisible = false;
      this.teamVisible = false;
      this.metericsVisible = false;
      this.permissionVisible = true;
      this.editHit = false;
  }

  invitesTapped(){
    if(this.inviteVisible === true){
      return;
    }

    this.teamVisible = false;
    this.metericsVisible = false;
    this.permissionVisible = false;
    this.inviteVisible = true;
    this.editHit = false;
  }

  leaveTapped(){

  }

  deleteTeam(){

  }

  deleteMember(){
    
  }

  private saveEditTeamName(name:string){

 
   
  }

  editTeamName(name:string){
    if(this.editTeamNameHit === true){
      this.editTeamNameHit =false;
      this.teamName = name;
      this.team.teamName = name;
      this.serverService.editTeam(this.team).subscribe(res=>{
          console.log(res);
      },err=>{
          console.error('Error updating the team in the server', err)
      });
      return;
    }
    this.editTeamNameHit = true;
  }

  editTeamDesc(desc:string){
    if(this.editTeamDescHit === true){
      this.editTeamDescHit =false;
      this.teamDesc = desc;
      this.team.teamDescription = desc;
      this.serverService.editTeam(this.team).subscribe(res=>{
          console.log(res);
      },err=>{
          console.error('Error updating the team in the server', err)
      });
      return;
    }
    this.editTeamDescHit = true;
  }

  inviteeTapped(){

  }

  teamPermissionTapped(){

  }


}
