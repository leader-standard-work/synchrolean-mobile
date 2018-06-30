import { Component, OnInit } from '@angular/core';

import { Task } from '../../shared/tasks/task';
import { TaskService } from '../../shared/tasks/tasks.service';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TaskService]
})
export class TaskListComponent implements OnInit {
  private tasks: Task[];
  constructor(private tasksService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.tasksService.getTasks();
  }

  getTasks(): Array<Task> {
    this.tasks = this.tasksService.getTasks();
    return this.tasks;
  }

}
