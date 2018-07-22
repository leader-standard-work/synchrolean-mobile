import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DatabaseService } from '~/shared/services/database.service';
import { Task, compareTask } from '~/shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Array<Task>;

  constructor(private databaseService: DatabaseService) {
    this.tasks = new Array<Task>();
  }

  public getTasks(): Observable<Task[]> {
    this.tasks = this.databaseService.getTasks();
    return of(this.tasks);
  }

  public addTask(task: Task): void {
    this.databaseService.insertTask(task).then(
      id => {
        task.databaseId = id;
        this.tasks.push(task);
        this.tasks.sort(compareTask);
      },
      error => {
        console.error('could not add task in task service', error);
      }
    );
  }

  public getTaskById(id: number): Task {
    for (let task of this.tasks) {
      if (task.databaseId === id) {
        return task;
      }
    }
    return null;
  }

  public updateTask(task: Task) {
    for (let value of this.tasks) {
      if (value.databaseId === task.databaseId) {
        value.name = task.name;
        value.description = task.description;
        value.duration = task.duration;
        value.complete = task.complete;
        this.databaseService.updateTask(value).then(
          id => {
            console.log(value);
          },
          error => {
            console.error('could not update task is task service', error);
          }
        );
      }
    }
  }

  public deleteTask(id: number) {
    this.tasks.forEach((item, index) => {
      if (item.databaseId === id) {
        item.delete();
        this.tasks.splice(index, 1);
        this.databaseService.updateTask(item);
      }
    });
  }

  public checkTask(task: Task) {
    this.tasks.forEach((item, index) => {
      if (item.databaseId === task.databaseId) {
        item.complete = task.complete;
        this.databaseService.updateTask(item);
        console.log(item);
      }
    });
  }

  private taskResetTimer() {
    console.log('RESET REACHED');
    this.tasks.forEach(task => {
      task.complete = false;
    });
  }
}
