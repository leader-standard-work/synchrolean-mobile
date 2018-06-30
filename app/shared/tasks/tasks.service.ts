import { Injectable } from '@angular/core';

import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[];

  constructor() {
    this.tasks = new Array<Task>();
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(): void {
    this.tasks.push(new Task('New Task'));
  }
}
