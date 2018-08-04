import { Injectable, Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';

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
  public team: Team;
  public teamName: string;
  public teamDesc: string;
  public members: ObservableArray<Account>;
  public tasks$: ObservableArray<Task>;
  public teams$:ObservableArray<Team>;
  public isOwner: Boolean;
  public teamVisible: boolean;
  public taskVisible: boolean;
  public editHit: boolean;
  public isMember:boolean;

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
    //Add 'implements OnInit' to the class.
    this.members = new ObservableArray<Account>();
    this.teamVisible = true;
    this.isOwner = false;
    this.taskVisible = false;
    this.isMember =false;
    // Get team by id
    this.serverService.getTeam(this.id).subscribe(
      response => {
        this.teamName = response.teamName;
        this.teamDesc = response.teamDescription;
        this.team = response;
        // Get team members call
        this.serverService.getTeamMembers(this.id).subscribe(
          accounts => {
            accounts.forEach(account => this.members.push(account));
            //check the user is a member of the team
            this.members.forEach((value)=>{
            if(value.ownerId === this.accountService.account.ownerId){
              this.isMember = true;

              //check if they are the owner
              this.isOwner =
              this.team.ownerId === this.accountService.account.ownerId
                ? true
                : false;
            }
          })
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

    //get invites
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
      this.editHit = false;
      this.taskVisible = false;
      this.teamVisible = true;
      return;
    }

    this.editHit = false;
    this.taskVisible = false;
    this.teamVisible = true;

  }

  taskTapped(){
    if(this.taskVisible === true){ 
      this.editHit = false;
      this.teamVisible = false;
      this.taskVisible = true;
      return;
    }

    this.teamVisible = false;
    this.taskVisible = true;
    this.editHit = false;
  }

  editTapped(){
    if(this.teamVisible === true){
      if(this.editHit === false){
         this.editHit = true;
      }
      else{ 
        this.editHit = false;
      }
    }

    this.teamVisible = true;
    this.taskVisible = false;
    return;
  }

}
