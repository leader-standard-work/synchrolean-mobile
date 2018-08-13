import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import {
  SegmentedBar,
  SegmentedBarItem
} from 'tns-core-modules/ui/segmented-bar/segmented-bar';
import { action, alert } from 'tns-core-modules/ui/dialogs/dialogs';

import { TaskService } from '~/shared/services/tasks.service';
import { Task, Duration } from '~/shared/models/task';

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
  private mode: Mode = Mode.New;
  private duration: Duration;

  public taskFormGroup: FormGroup;
  public title: string;
  public weekdays: number;
  public task: Task;
  public deleteButtonVisible: string;
  public durationBarItems: Array<SegmentedBarItem>;
  public durationBarIndex: number;

  constructor(
    private tasksService: TaskService,
    private formBuilder: FormBuilder,
    private pageRoute: PageRoute,
    private routerExtensions: RouterExtensions
  ) {
    this.pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        this.task = this.tasksService.getTaskById(+params['id']);
      });
  }

  ngOnInit(): void {
    this.title = 'New Task';
    this.deleteButtonVisible = 'collapse';
    let name = '';
    let description = '';
    let onceItem = new SegmentedBarItem();
    let dailyItem = new SegmentedBarItem();
    let weeklyItem = new SegmentedBarItem();
    let monthlyItem = new SegmentedBarItem();

    onceItem.title = Duration.Once;
    dailyItem.title = Duration.Daily;
    weeklyItem.title = Duration.Weekly;
    monthlyItem.title = Duration.Monthly;

    this.durationBarItems = [onceItem, dailyItem, weeklyItem, monthlyItem];

    if (this.task != null) {
      name = this.task.name;
      description = this.task.description;
      this.duration = this.task.duration;
      this.weekdays = this.task.weekdays;
      this.title = 'Edit Task';
      this.mode = Mode.Edit;
      this.deleteButtonVisible = 'visible';
    }

    this.setDurationBar();
    this.weekdays = 0;

    this.taskFormGroup = this.formBuilder.group({
      description: [name, Validators.required],
      note: description
    });
  }

  private setDurationBar() {
    let index: number = 0;
    switch (this.duration) {
      case Duration.Once: {
        index = 0;
        break;
      }
      case Duration.Daily: {
        index = 1;
        break;
      }
      case Duration.Weekly: {
        index = 2;
        break;
      }
      case Duration.Monthly: {
        index = 3;
        break;
      }
      default: {
        index = 0;
        break;
      }
    }
    this.durationBarIndex = index;
  }

  onDurationSelected(args) {
    let segmentedBar = <SegmentedBar>args.object;
    switch (segmentedBar.selectedIndex) {
      case 0: {
        this.duration = Duration.Once;
        break;
      }
      case 1: {
        this.duration = Duration.Daily;
        break;
      }
      case 2: {
        this.duration = Duration.Weekly;
        break;
      }
      case 3: {
        this.duration = Duration.Monthly;
        break;
      }
      default: {
        this.duration = Duration.Once;
        break;
      }
    }
  }

  daySelected($event) {}

  onSave() {
    let name = this.taskFormGroup.value.description;
    let description = this.taskFormGroup.value.note;
    let options = {
      title: 'Descripton Required',
      okButtonText: 'Ok'
    };

    if (name !== '') {
      switch (this.mode) {
        case Mode.New: {
          options.title = 'New task added';
          let task: Task = new Task(name, description, this.duration);
          task.weekdays = this.weekdays;
          this.tasksService.addTask(task);
          this.taskFormGroup.reset();
          alert(options);
          break;
        }
        case Mode.Edit: {
          let task: Task = new Task(name, description, this.duration);
          task.databaseId = this.task.databaseId;
          task.weekdays = this.weekdays;
          this.tasksService.updateTask(task);
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
        this.tasksService.deleteTask(this.task.databaseId);
        this.routerExtensions.navigate(['/task-list'], {
          clearHistory: true,
          transition: { name: 'slideRight' }
        });
      }
    });
  }
}
