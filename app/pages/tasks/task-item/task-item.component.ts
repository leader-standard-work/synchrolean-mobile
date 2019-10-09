import {
  Component,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { Color } from 'tns-core-modules/color/color';

import { Task } from '~/shared/models/task';
import { TaskService } from '~/shared/services/tasks.service';

@Component({
  selector: 'task-item',
  moduleId: module.id,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnChanges, AfterViewInit {
  private initialized: boolean = false;
  public backgroundColor: Color;

  @Input() task: Task;
  @Output() checked = new EventEmitter();
  @ViewChild('CB', {static: false}) checkBox: ElementRef;

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.task = changes['task'].currentValue;
    if (this.initialized) {
      this.checkBox.nativeElement.checked = this.task.isCompleted;
    }
    if (this.task.isCompleted) {
      this.backgroundColor = new Color('lightGreen');
    } else {
      this.backgroundColor = new Color('white');
    }
  }

  ngAfterViewInit() {
    this.initialized = true;
    this.checkBox.nativeElement.checked = this.task.isCompleted;
  }

  onChecked() {
    if (this.initialized) {
      this.task.isCompleted = this.checkBox.nativeElement.checked;
      if (this.task.isCompleted) {
        this.backgroundColor = new Color('lightGreen');
      } else {
        this.backgroundColor = new Color('white');
      }
      this.taskService.checkTask(this.task);
      this.checked.emit();
    }
  }
}
