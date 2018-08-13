import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DatabaseService } from '~/shared/services/database.service';
import { Task, compareTask, Duration } from '~/shared/models/task';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '~/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Array<Task>;

  constructor(private databaseService: DatabaseService,
    private http: HttpClient,
    private authService: AuthenticationService) {
    this.tasks = new Array<Task>();
  }

  public getTasks(): Observable<Task[]> {
    this.tasks = this.databaseService.getTasks();
    return of(this.tasks);
  }

  public getUpdatedTasks(): Observable<Task[]> {
    this.tasks.sort(compareTask);
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

  taskReset() {
    this.tasks.forEach(task => {
      let today = new Date();
      if (task.expires < today) {
        if (task.duration === Duration.Once) {
          task.delete();
        }
        task.setResetDate();
        task.complete = false;
      }
    });
    this.tasks.sort(compareTask);
  }


  //this is after refeactor
  getuserTodo(email: string): Observable<Task[]> {
    let endpoint = this.authService.url + '/api/tasks/todo/' + email;
    return this.http.get<Task[]>(endpoint);
  }
}
