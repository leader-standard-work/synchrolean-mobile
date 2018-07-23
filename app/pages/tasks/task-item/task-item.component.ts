import {
  Component,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Color } from 'color';

import { Task } from '~/shared/models/task';
import { TaskService } from '~/shared/services/tasks.service';

@Component({
  selector: 'task-item',
  moduleId: module.id,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnChanges {
  private initialized: boolean = false;
  public backgroundColor: Color;

  @Input() task: Task;
  @Output() checked = new EventEmitter();
  @ViewChild('CB') checkBox: ElementRef;

  constructor(private taskService: TaskService) {}

  // ngOnInit() {
  //   if (this.task.complete) {
  //     this.backgroundColor = new Color('lightGreen');
  //   } else {
  //     this.backgroundColor = new Color('white');
  //   }
  //   this.checkBox.nativeElement.checked = this.task.complete;
  //   this.initialized = true;
  // }

  ngOnChanges(changes: SimpleChanges) {
    this.task = changes['task'].currentValue;
    this.checkBox.nativeElement.checked = this.task.complete;
    if (this.task.complete) {
      this.backgroundColor = new Color('lightGreen');
    } else {
      this.backgroundColor = new Color('white');
    }
    this.initialized = true;
  }

  onChecked() {
    if (this.initialized) {
      this.task.complete = this.checkBox.nativeElement.checked;
      this.taskService.checkTask(this.task);
      this.checked.emit();
    }
  }
}
