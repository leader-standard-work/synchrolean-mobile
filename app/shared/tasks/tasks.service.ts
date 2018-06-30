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

  addTask(description: string): void {
    this.tasks.push(new Task(description));
    console.log('New Task: ' + description);
  }
}
