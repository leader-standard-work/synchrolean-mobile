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
    //get table
    return of(this.tasks);
  }

  public addTask(description: string): void {
    //change to insert
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
      //change to select
      if (task.getId() === id) {
        //fille task and change info
        task.setDescription(description);
        //run update
      }
    }
  }
}
