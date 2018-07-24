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
  private timerId: number;
  private midnight: Date;

  constructor(
    tasksService: TaskService,
    private routerExtensions: RouterExtensions
  ) {
    this.tasksService = tasksService;
  }

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();

    this.midnight = new Date();
    this.midnight.setHours(24, 0, 0, 0);
    this.timerId = setInterval(() => {
      let now = new Date();
      if (now > this.midnight) {
        this.tasksService.taskReset();
        this.tasks$ = this.tasksService.getUpdatedTasks();
        this.midnight.setHours(24, 0, 0, 0);
      }
    }, 60 * 1000);
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
