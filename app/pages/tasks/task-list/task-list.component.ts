import { Component, OnInit } from '@angular/core';

import { Task } from '~/shared/tasks/task';
import { TaskService } from '~/shared/tasks/tasks.service';
import { Observable } from 'rxjs';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks$: Observable<Array<Task>>;
  private tasksService: TaskService;

  constructor(tasksService: TaskService, private routerE:RouterExtensions) {
    this.tasksService = tasksService;
  }

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
  }

  teamTap(){
    this.routerE.navigate(['/teams'],{
      transition:{
        name: "slideBottom"
      }
    });
  }

}
