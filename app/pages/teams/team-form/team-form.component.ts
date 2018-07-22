//This file contains the team-form component, used in the creation of a new team
import { Component, OnInit } from '@angular/core';
import { TeamService } from '~/shared/teams/teams.service';

@Component({
    selector: 'team-form',
    moduleId: module.id,
    templateUrl: './team-form.component.html',
    styleUrls: ['./team-form.component.html']
})

export class TeamFormComponent implements OnInit {
    //data items here

    constructor(){
        //not implemented yet
    }
    ngOnInit(): void {

    }
}