import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';

import { Task } from '~/shared/models/task';
import { TaskService } from '~/shared/services/tasks.service';
import { ServerService } from '~/shared/services/server.service';
import { AuthenticationService } from '~/shared/services/auth.service';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks$: Observable<Array<Task>>;
  private timerId: number;
  private midnight: Date;

  constructor(
    private authService: AuthenticationService,
    private tasksService: TaskService,
    private routerExtensions: RouterExtensions
  ) {}

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
    if (this.authService.isLoggedIn()) {
      this.routerExtensions.navigate(['/teams'], {
        clearHistory: true,
        animated: false
      });
    } else {
      this.routerExtensions.navigate(['/login'], {
        clearHistory: true,
        animated: false
      });
    }
  }

  accountTapped() {
    this.routerExtensions.navigate(['/account'], {
      clearHistory: true,
      animated: false
    });
  }

  onChecked() {
    this.tasks$ = this.tasksService.getUpdatedTasks();
  }
}
