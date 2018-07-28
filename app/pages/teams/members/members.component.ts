import { teamMembers } from "~/shared/dummyData"
import { Injectable, Input, Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { Account } from "~/shared/models/account";
import { Team } from "~/shared/models/team";


@Injectable({
    providedIn: 'root'
})

// class members{
//     name: string;
//     id: number;
// }

// class Team{
//     name: string;
//     teamId:number;
//     description: string;
//     members:Array<members>;
// }

@Component({
    selector: 'Members',
    moduleId: module.id,
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css']
  })

export class MembersComponent implements OnInit {
    public team: Team;
    public members: Array<Account>;
    public teamName: string;
    public teamDescription: string;
    private id: number;
    private isOwner: Boolean;

    constructor(private pageR:PageRoute, private routerE:RouterExtensions){
        this.members = new Array<Account>();
        this.teamName = "";
        this.teamDescription = "";
        this.isOwner = false;
        this.pageR.activatedRoute.pipe(
            switchMap(activatedRoute => activatedRoute.params)
        ).forEach((params)=> {this.id = +params["id"];})
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.members = JSON.parse(teamMembers);
        this.teamDescription = "Best Team Ever!";
        this.teamName = "Team C";
        //check ownership

    }

    onTap(id:number) {
        this.routerE.navigate(['/members-tasks', id], {
          transition: {
            name: 'slideLeft'
          }
        });
      }
}