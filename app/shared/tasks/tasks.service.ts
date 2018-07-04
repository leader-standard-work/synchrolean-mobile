import { Injectable, OnInit } from '@angular/core';

import { Task, Duration } from './task';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {
  private tasks: Array<Task>;

  constructor() {
    //sql
    this.tasks = new Array<Task>();
  }

  ngOnInit(): void {}

  public getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  public addTask(description: string, duration: Duration, note: string): void {
    this.tasks.push(new Task(description, duration, note));
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

  public updateTask(
    id: number,
    description: string,
    duration: Duration,
    note: string
  ) {
    for (let task of this.tasks) {
      if (task.getId() === id) {
        task.setDescription(description);
        task.setNote(note);
        task.setDuration(duration);
      }
    }
  }

  public deleteTask(id: number) {
    this.tasks.forEach((item, index) => {
      if (item.getId() === id) {
        this.tasks.splice(index, 1);
      }
    });
  }
}
