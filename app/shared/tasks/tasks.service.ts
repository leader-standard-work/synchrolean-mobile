import { Injectable, OnInit } from '@angular/core';

import { Task, Duration } from './task';
import { Observable, of } from 'rxjs';
import { dataBase } from '~/shared/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {
  private tasks: Array<Task>;
  private db: dataBase;

  constructor() {
    this.db = new dataBase();
    this.tasks = new Array<Task>();
  }

  ngOnInit(): void {}

  public getTasks(): Observable<Task[]> {
    this.tasks = this.db.fetch();
    return of(this.tasks);
  }

  public addTask(task: Task): void {
    this.db.insert(task).then(
      id => {
        task.setId(id);
        this.tasks.push(task);
        console.log(this.tasks);
      },
      error => {
        console.log(error);
      }
    );
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
