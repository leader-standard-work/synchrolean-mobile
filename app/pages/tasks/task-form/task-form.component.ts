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
import { Task, Frequency } from '~/shared/models/task';

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
  private frequency: Frequency;

  public task: Task;
  public taskFormGroup: FormGroup;
  public title: string;
  public weekdays: number;
  public dayBoxesVisible = false;
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
    this.frequency = 0;
    this.weekdays = 0;
    this.deleteButtonVisible = 'collapse';
    let name = '';
    let description = '';
    let onceItem = new SegmentedBarItem();
    let dailyItem = new SegmentedBarItem();
    let weeklyItem = new SegmentedBarItem();
    let monthlyItem = new SegmentedBarItem();

    onceItem.title = 'Once';
    dailyItem.title = 'Daily';
    weeklyItem.title = 'Weekly';
    monthlyItem.title = 'Monthly';

    this.durationBarItems = [onceItem, dailyItem, weeklyItem, monthlyItem];

    if (this.task !== null) {
      name = this.task.name;
      description = this.task.description;
      this.frequency = this.task.frequency;
      this.weekdays = this.task.weekdays;
      if (this.frequency === Frequency.Daily) {
        this.dayBoxesVisible = true;
      } else {
        this.dayBoxesVisible = false;
      }
      this.title = 'Edit Task';
      this.mode = Mode.Edit;
      this.deleteButtonVisible = 'visible';
    }

    this.setDurationBar();

    this.taskFormGroup = this.formBuilder.group({
      name: [name, Validators.required],
      description: description
    });
  }

  private setDurationBar() {
    this.durationBarIndex = this.frequency;
  }

  onDurationSelected(args) {
    let segmentedBar = <SegmentedBar>args.object;
    this.frequency = segmentedBar.selectedIndex;
    if (this.frequency === Frequency.Daily) {
      this.dayBoxesVisible = true;
    } else {
      this.dayBoxesVisible = false;
    }
  }

  daySelected(weekdays: number) {
    this.weekdays = weekdays;
  }

  onSave() {
    let name = this.taskFormGroup.value.name;
    let description = this.taskFormGroup.value.description;
    let options = {
      title: 'Descripton Required',
      okButtonText: 'Ok'
    };

    if (name !== '') {
      let task: Task = new Task();
      task.name = name;
      task.description = description;
      task.frequency = this.frequency;
      task.weekdays = this.weekdays;
      if (this.frequency === Frequency.Once) {
        task.isRecurring = false;
      } else {
        task.isRecurring = true;
      }
      switch (this.mode) {
        case Mode.New: {
          options.title = 'New task added';
          this.tasksService.addTask(task);
          this.taskFormGroup.reset();
          this.weekdays = 0;
          alert(options);
          break;
        }
        case Mode.Edit: {
          task.databaseId = this.task.databaseId;
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
