import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { Task } from '~/shared/models/task';
import { TaskService } from '~/shared/services/tasks.service';

@Component({
  selector: 'task-item',
  moduleId: module.id,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  private initialized: boolean = false;

  @Input() task: Task;
  @ViewChild('CB') checkBox: ElementRef;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.checkBox.nativeElement.checked = this.task.complete;
    this.initialized = true;
  }

  onChecked() {
    if (this.initialized) {
      this.task.complete = this.checkBox.nativeElement.checked;
      this.taskService.checkTask(this.task);
    }
  }
}
