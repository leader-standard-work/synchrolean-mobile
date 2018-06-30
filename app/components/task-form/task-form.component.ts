import { Component, OnInit } from '@angular/core';
import { TaskService } from '~/shared/tasks/tasks.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap } from 'rxjs/operators';
import { Task } from '~/shared/tasks/task';

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

  public taskFormGroup: FormGroup;
  public title: string = 'New Task';
  public task: Task;

  constructor(
    tasksService: TaskService,
    formBuilder: FormBuilder,
    pageRoute: PageRoute
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
    switch (this.mode) {
      case Mode.New: {
        this.tasksService.addTask(this.taskFormGroup.value.description);
        this.taskFormGroup.reset();
        break;
      }
      case Mode.Edit: {
        let description = this.taskFormGroup.value.description;
        this.tasksService.updateTask(this.task.getId(), description);
        break;
      }
    }
  }
}
