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
  public tasks$: Array<ObservableArray<Task>>;
  public teams$:ObservableArray<Team>;
  public isOwner: Boolean;
  public teamVisible: boolean;
  public taskVisible: Array<boolean>;
  public editHit: boolean;
  public isMember:boolean;
  public metericsVisible: boolean;
  public tasks:Array<Array<string>>;
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

    this.tasks = new Array<Array<string>>(["Take out garbagesdafsadfdscsdafdscdsafdscdsacdscsadf" ,"Cut grass", "Read book", "watch youtube", "code", "Cut grass", "Read book", "watch youtube", "code","code", "Cut grass", "Read book", "watch youtube", "code", 'read','walk the dog', 'play prepatch', 'wash car'],['read','walk the dog', 'play prepatch', 'wash car']);

    this.members = new ObservableArray<Account>();
    this.tasks$ = new Array<ObservableArray<Task>>();
    this.teamVisible = true;
    this.isOwner = false;
    this.taskVisible = new Array<boolean>(false);
    this.isMember =false;
    this.metericsVisible=false;
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
              if(account.ownerId === this.accountService.account.ownerId){
                this.isMember = true;
  
                //check if they are the owner
                this.isOwner =
                this.team.ownerId === this.accountService.account.ownerId
                  ? true
                  : false;
              }
            });
            //check the user is a member of the team
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
  onTap(index: number) {
    //
    // this.routerE.navigate(['/members-tasks', id], {
    //   transition: {
    //     name: 'slideLeft'
    //   }
    // });
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
      this.editHit = false;
      this.teamVisible = true;
      return;
    }

    this.editHit = false;
    this.teamVisible = true;
    this.metericsVisible = true;
  }

  metricsTapped(){
    if(this.metericsVisible === true){ 
      this.editHit = false;
      this.teamVisible = false;
      this.metericsVisible = true;
      return;
    }

    this.teamVisible = false;
    this.metericsVisible = true;
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
    this.metericsVisible = false;
    return;
  }

  deleteTeam(){

  }

  deleteMember(){
    
  }

  editTeamName(){

  }

  editTeamDesc(){

  }

  invitesTapped(){

  }

  permissionsTapped(){

  }
}
