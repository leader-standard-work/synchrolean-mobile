import { Component, OnInit } from '@angular/core';

import { Task } from '~/shared/tasks/task';
import { TaskService } from '~/shared/tasks/tasks.service';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks$: Observable<Array<Task>>;
  private tasksService: TaskService;

  constructor(tasksService: TaskService, private routerE: RouterExtensions) {
    this.tasksService = tasksService;
  }

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
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
