import { Component, OnInit } from '@angular/core';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { TaskService } from '~/shared/tasks/tasks.service';
import { Task } from '~/shared/tasks/task';

@Component({
  selector: 'task-detail',
  moduleId: module.id,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  private tasksService: TaskService;
  private pageRoute: PageRoute;

  public task: Task;

  constructor(taskService: TaskService, pageRoute: PageRoute) {
    this.tasksService = taskService;
    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.task = this.tasksService.getTaskById(+params['id']);
      });
  }

  ngOnInit(): void {}
}
