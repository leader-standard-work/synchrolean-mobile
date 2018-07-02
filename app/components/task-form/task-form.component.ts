import { Component, OnInit } from '@angular/core';
import { TaskService } from '~/shared/tasks/tasks.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { Task } from '~/shared/tasks/task';
import { Router } from '@angular/router';

enum Mode {
  New,
  Edit
}

@Component({
  selector: 'task-form',
  moduleId: module.id,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  private tasksService: TaskService;
  private pageRoute: PageRoute;
  private formBuilder: FormBuilder;
  private routerExtensions: RouterExtensions;
  private mode: Mode = Mode.New;
  private router: Router;

  public taskFormGroup: FormGroup;
  public title: string = 'New Task';
  public task: Task;

  constructor(
    tasksService: TaskService,
    formBuilder: FormBuilder,
    pageRoute: PageRoute,
  ) {
    let desc = '';
    this.tasksService = tasksService;
    this.pageRoute = pageRoute;
    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.task = this.tasksService.getTaskById(+params['id']);
      });

    if (this.task != null) {
      desc = this.task.getDescription();
      this.title = 'Edit Task';
      this.mode = Mode.Edit;
    }

    this.formBuilder = formBuilder;
    this.taskFormGroup = this.formBuilder.group({
      description: [desc, Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave() {
    let description = this.taskFormGroup.value.description;
    switch (this.mode) {
      case Mode.New: {
        this.tasksService.addTask(description);
        this.router.navigate(['\task-list']);
        this.taskFormGroup.reset();
        break;
      }
      case Mode.Edit: {
        this.tasksService.updateTask(this.task.getId(), description);
        break;
      }
    }
    //this.router.navigate(["/task-list"]);
  }
}
