import { Injectable, OnInit } from '@angular/core';

import { Task } from './task';
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

  public addTask(description: string, note: string): void {
    this.tasks.push(new Task(description, note));
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

  public updateTask(id: number, description: string, note: string) {
    for (let task of this.tasks) {
      if (task.getId() === id) {
        task.setDescription(description);
        task.setNote(note);
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
