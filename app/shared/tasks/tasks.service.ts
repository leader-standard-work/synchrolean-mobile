import { Injectable } from '@angular/core';

import { Task } from './task';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Array<Task>;

  constructor() {
    this.tasks = new Array<Task>();
  }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addTask(description: string): void {
    this.tasks.push(new Task(description));
    console.log(this.tasks);
  }
}
