import { teamMembers } from "~/shared/dummyData"
import { Injectable, Input, Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})

class members{
    name: string;
    id: number;
}

class Team{
    name: string;
    teamId:number;
    members:Array<members>;
}

@Component({
    selector: 'Members',
    moduleId: module.id,
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css']
  })

export class MembersComponent implements OnInit {

    public team: Team;
    public names: Array<string>;
    private id: number;

    constructor(private pageR:PageRoute, private routerE:RouterExtensions){
        this.team = new Team();
        this.names = new Array<string>();
        this.pageR.activatedRoute.pipe(
            switchMap(activatedRoute => activatedRoute.params)
        ).forEach((params)=> {this.id = +params["id"];})
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.team = JSON.parse(teamMembers); 
        this.getNames();
    }

    getNames(){
        let length = this.team.members.length;
        for(let i=0;i<length;++i){
            this.names.push(this.team.members[i].name.toString());
        }
    }

    getTeamName():string{
        return (this.team.name);
    }

    tasksTapped() {
        this.routerE.navigate(['/task-list'], {
          clearHistory: true,
          transition: {
            name: 'fade'
          }
        });
      }

    teamTapped() {
    this.routerE.navigate(['/teams'], {
        clearHistory: true,
        transition: {
        name: 'fade'
        }
    });
    }

}