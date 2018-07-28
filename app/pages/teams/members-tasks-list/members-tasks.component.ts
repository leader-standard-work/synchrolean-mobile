import { tasks } from "~/shared/dummyData"
import { Component, OnInit } from "@angular/core";
import { Task } from "~/shared/models/task";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { TeamServerInterface } from "~/shared/models/team";
import { Account, AccountServerInterface } from "~/shared/models/account";
@Component({
    selector: 'members-tasks',
    moduleId: module.id,
    templateUrl: './members-tasks.component.html',
    styleUrls: ['./members-tasks.component.css']
})

export class MembersTasksComponent implements OnInit{
    public tasks: Array<Task>;
    private id:number;
    public user: Account;
    
    constructor(private pageR:PageRoute, private routerE:RouterExtensions){
        this.tasks = new Array<Task>();
        this.pageR.activatedRoute.pipe(
            switchMap(activatedRoute => activatedRoute.params)
        ).forEach((params)=> {this.id = +params["id"];})
    }

    ngOnInit(){
        this.tasks = JSON.parse(tasks);
    }
}