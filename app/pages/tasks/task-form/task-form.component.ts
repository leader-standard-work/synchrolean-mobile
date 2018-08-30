import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import {
  SegmentedBar,
  SegmentedBarItem
} from 'tns-core-modules/ui/segmented-bar/segmented-bar';
import { action, alert } from 'tns-core-modules/ui/dialogs/dialogs';

import { TaskService } from '~/shared/services/tasks.service';
import { Task, Frequency } from '~/shared/models/task';
import { AuthenticationService } from '~/shared/services/auth.service';
import { AccountService } from '~/shared/services/account.service';

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
  private teamId: number;

  public task: Task;
  public teams: Array<{ name: string; id: number }>;
  public teamNames: Array<string>;
  public listPickerText: Observable<string[]>;
  public pickerIndex: number;
  public taskFormGroup: FormGroup;
  public title: string;
  public weekdays: number;
  public loggedIn: boolean;

  public dayBoxesVisible = false;
  public deleteButtonVisible: string;
  public durationBarItems: Array<SegmentedBarItem>;
  public durationBarIndex: number;

  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
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
    this.teamId = 0;
    this.loggedIn = false;
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
    this.pickerIndex = 0;

    // If the user is logged in display a list of teams.
    if (this.authService.isLoggedIn()) {
      this.teamNames = new Array<string>();
      this.teams = new Array<{ name: string; id: number }>();
      this.teams.push({ name: 'No Team Selected', id: -1 });
      this.teamNames.push('No Team Selected');
      this.accountService.getTeamsForAccount(this.authService.email).subscribe(
        teams => {
          for (let team of teams) {
            this.teams.push({ name: team.teamName, id: team.id });
            this.teamNames.push(team.teamName);
          }
          this.listPickerText = of(this.teamNames);
          if (this.task !== null && this.task.teamId !== -1) {
            this.teams.forEach((team, index) => {
              if (team.id === this.task.teamId) {
                this.pickerIndex = index;
              }
            });
          }
          this.loggedIn = true;
        },
        error => {
          console.error(
            'could not get teams for account: ',
            this.authService.email,
            error
          );
        }
      );
    }

    // Set the task variables if a task as been passed in
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

  selectedIndexChanged(args) {
    let picker = <ListPicker>args.object;
    const index = picker.selectedIndex;
    if (index > 0 || index < this.teams.length) {
      this.teamId = this.teams[index].id;
    }
  }

  onSave() {
    let name = this.taskFormGroup.value.name;
    let description = this.taskFormGroup.value.description;
    let options = {
      title: 'Descripton Required',
      okButtonText: 'Ok'
    };

    if (name !== '') {
      let task: Task;

      if (this.mode === Mode.Edit) {
        task = new Task(this.task);
      } else {
        task = new Task();
      }
      task.name = name;
      task.description = description;
      task.frequency = this.frequency;
      if (task.frequency === Frequency.Daily && this.weekdays === 0) {
        task.weekdays = 127;
      } else {
        task.weekdays = this.weekdays;
      }
      task.teamId = this.teamId === 0 ? -1 : this.teamId;
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
          this.tasksService.updateTask(task);
          this.routerExtensions.navigate(['/task-list'], {
            transition: {
              name: 'slideBottom'
            },
            clearHistory: true
          });
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

  backToTasks() {
    this.routerExtensions.navigate(['/task-list'], {
      transition: {
        name: 'slideBottom'
      },
      clearHistory: true
    });
  }
}
