import { teamMembers } from '~/shared/dummyData';
import { Injectable, Input, Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { Account } from '~/shared/models/account';
import { Team } from '~/shared/models/team';
import * as dialogs from 'ui/dialogs';

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
  private id: number;
  private isOwner: Boolean;

  constructor(private pageR: PageRoute, private routerE: RouterExtensions) {
    this.members = new Array<Account>();
    this.teamName = '';
    this.teamDescription = '';
    this.isOwner = true;
    this.pageR.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.id = +params['id'];
      });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.members = JSON.parse(teamMembers);
    this.teamDescription = 'Best Team Ever!';
    this.teamName = 'Team C';
    //check ownership
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
    console.log('Edit tapped');
    dialogs
      .prompt({
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
