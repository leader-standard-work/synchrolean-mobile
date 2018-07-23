import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

import { Task } from '~/shared/models/task';
import { TaskService } from '~/shared/services/tasks.service';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks$: Observable<Array<Task>>;
  private tasksService: TaskService;

  constructor(
    tasksService: TaskService,
    private routerExtensions: RouterExtensions
  ) {
    this.tasksService = tasksService;
  }

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
  }

  teamTapped() {
    this.routerExtensions.navigate(['/teams'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }

  metricsTapped() {
    this.routerExtensions.navigate(['/metrics'], {
      clearHistory: true,
      transition: {
        name: 'fade'
      }
    });
  }

  onChecked() {
    this.tasks$ = this.tasksService.getUpdatedTasks();
  }
}
