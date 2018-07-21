import { Injectable, OnInit } from '@angular/core';

import { Task } from '~/shared/models/task';
import { Observable, of } from 'rxjs';
import { DBService } from '~/shared/database/database.service';
import { ServerService } from '~/shared/server/server.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Array<Task>;

  constructor(
    private databaseService: DBService,
    private serverService: ServerService
  ) {
    this.tasks = new Array<Task>();
  }

  public getTasks(): Observable<Task[]> {
    this.tasks = this.databaseService.fetch();

    return of(this.tasks);
  }

  public addTask(task: Task): void {
    this.db.insert(task).then(
      id => {
        task.setId(id);
        this.tasks.push(task);

        this.serverService.postTask(task);
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

  public updateTask(task: Task) {
    for (let value of this.tasks) {
      if (value.getId() === task.getId()) {
        value.setDescription(task.getDescription());
        value.setNote(task.getNote());
        value.setDuration(task.getDuration());
        value.setComplete(task.isComplete());
        value.setDate(task.getDate());
        this.db.update(value).then(
          id => {
            console.log(value);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  public deleteTask(id: number) {
    this.tasks.forEach((item, index) => {
      if (item.getId() === id) {
        //change to delete db
        this.db.update(item);
        this.tasks.splice(index, 1);
      }
    });
  }

  public checkTask(task: Task) {
    this.tasks.forEach((item, index) => {
      if (item.getId() === task.getId()) {
        item.setComplete(task.isComplete());
        this.db.update(item);
        // this.tasks.splice(index, 1);
        console.log(item);
      }
    });
  }

  private taskResetTimer() {
    console.log('RESET REACHED');
    this.tasks.forEach(task => {
      task.setComplete(false);
    });
  }
}
