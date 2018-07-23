import { Component, OnInit } from '@angular/core';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';

import { TaskService } from '~/shared/services/tasks.service';
import { Task } from '~/shared/models/task';

@Component({
  selector: 'task-detail',
  moduleId: module.id,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  public task: Task;

  constructor(private taskService: TaskService, private pageRoute: PageRoute) {
    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.task = this.taskService.getTaskById(+params['id']);
      });
  }

  ngOnInit(): void {}

  public getRoute(): string {
    let route = '/task-edit/:' + this.task.databaseId.toString();
    return route;
  }
}
