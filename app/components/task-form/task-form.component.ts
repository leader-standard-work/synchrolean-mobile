import { Component, OnInit } from '@angular/core';
import { TaskService } from '~/shared/tasks/tasks.service';

import { Task } from '~/shared/tasks/task';
@Component({
  selector: 'task-form',
  moduleId: module.id,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TaskService]
})
export class TaskFormComponent implements OnInit {
  private task: Task;
  constructor(private tasksService: TaskService) {}

  ngOnInit(): void {}

  onSave() {
    this.tasksService.addTask();
  }
}
