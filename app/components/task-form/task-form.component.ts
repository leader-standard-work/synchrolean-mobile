import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { action, alert } from 'ui/dialogs';

import { TaskService } from '~/shared/tasks/tasks.service';
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
  private routerExtensions: RouterExtensions;
  private formBuilder: FormBuilder;
  private mode: Mode = Mode.New;

  public taskFormGroup: FormGroup;
  public title: string = 'New Task';
  public task: Task;
  public deleteButtonVisible: string = 'collapse';

  constructor(
    tasksService: TaskService,
    formBuilder: FormBuilder,
    pageRoute: PageRoute,
    routerExtensions: RouterExtensions
  ) {
    let desc = '';
    let note = '';

    this.tasksService = tasksService;
    this.routerExtensions = routerExtensions;
    this.pageRoute = pageRoute;

    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.task = this.tasksService.getTaskById(+params['id']);
      });

    if (this.task != null) {
      desc = this.task.getDescription();
      note = this.task.getNote();
      this.title = 'Edit Task';
      this.mode = Mode.Edit;
      this.deleteButtonVisible = 'visible';
    }

    this.formBuilder = formBuilder;
    this.taskFormGroup = this.formBuilder.group({
      description: [desc, Validators.required],
      note: note
    });
  }

  ngOnInit(): void {}

  onSave() {
    let description = this.taskFormGroup.value.description;
    let note = this.taskFormGroup.value.note;
    let options = {
      title: 'Descripton Required',
      okButtonText: 'Ok'
    };

    if (description !== '') {
      switch (this.mode) {
        case Mode.New: {
          options.title = 'New task added';
          this.tasksService.addTask(description, note);
          this.taskFormGroup.reset();
          alert(options);
          break;
        }
        case Mode.Edit: {
          this.tasksService.updateTask(this.task.getId(), description, note);
          this.routerExtensions.backToPreviousPage();
          break;
        }
      }
    } else {
      alert(options);
    }
  }

  onDelete() {
    let options = {
      cancelButtonText: 'Cancel',
      actions: ['Delete']
    };

    action(options).then(result => {
      if (result === 'Delete') {
        this.tasksService.deleteTask(this.task.getId());
        this.routerExtensions.navigate(['/task-list'], {
          clearHistory: true,
          transition: { name: 'slideRight' }
        });
      }
    });
  }
}
