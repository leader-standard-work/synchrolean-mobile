import { teamMembers } from "~/shared/dummyData"
import { Injectable, Input, Component, OnInit } from "@angular/core";
import { Observable, of } from 'rxjs';


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
    selector: 'team-list',
    moduleId: module.id,
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.css']
  })

export class TeamListComponent implements OnInit {

    public team: Team;
    public names: Array<string>;

    constructor(){
        this.team = new Team();
        this.names = new Array<string>();
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

}