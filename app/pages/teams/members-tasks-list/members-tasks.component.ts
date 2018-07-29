import { tasks } from "~/shared/dummyData"
import { Component, OnInit } from "@angular/core";
import { Task } from "~/shared/models/task";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { switchMap } from "rxjs/operators";
import { Account, AccountServerInterface } from "~/shared/models/account";

//name component and the markup and stayle sheet
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
        this.tasks = new Array<Task>();  //make new array of tasks

        //get param from navigation
        this.pageR.activatedRoute.pipe(
            switchMap(activatedRoute => activatedRoute.params)
        ).forEach((params)=> {this.id = +params["id"];})
    }

    
    ngOnInit(){
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        //make call to server using server service
        this.tasks = JSON.parse(tasks);
    }
}