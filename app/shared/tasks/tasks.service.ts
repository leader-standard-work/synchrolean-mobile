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

  public getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  public addTask(description: string): void {
    this.tasks.push(new Task(description));
    console.log(this.tasks);
  }

  public getTaskById(id: number): Task {
    for (let task of this.tasks) {
      if (task.getId() === id) {
        return task;
      }
    }
    return null;
  }

  public updateTask(id: number, description: string) {
    for (let task of this.tasks) {
      if (task.getId() === id) {
        task.setDescription(description);
      }
    }
  }
}
