import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { Task } from '~/shared/tasks/task';
import { TaskService } from '~/shared/tasks/tasks.service';

@Component({
  selector: 'task-item',
  moduleId: module.id,
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  private tasksService: TaskService;
  private initialized: boolean = false;

  @Input() task: Task;
  @ViewChild('CB') checkBox: ElementRef;

  constructor(taskService: TaskService) {
    this.tasksService = taskService;
  }

  ngOnInit() {
    this.checkBox.nativeElement.checked = this.task.isComplete();
    this.initialized = true;
  }

  onChecked() {
    if (this.initialized) {
      this.task.setComplete(this.checkBox.nativeElement.checked);
      this.tasksService.checkTask(this.task);
    }
  }
}
