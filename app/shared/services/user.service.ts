import { Injectable } from '@angular/core';
import { ServerService } from '~/shared/server/server.service';
import { DBService } from '~/shared/database/database.service';
import { Account} from '../account/account';
import { Task} from '../models/tasks';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private serverService: ServerService;
    private db: DBService;
    private _account: Account;
    private _tasks: Task[];

    constructor(serverService: ServerService, dbService: DBService) {
        this.serverService = serverService;
        this.db = dbService;
        this._account = null;
        this._tasks = new Array<Task>();
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
    for (let value of this._tasks) {
      if (value.databaseId === task.databaseId) {
        value.name = task.name;
        value.description = task.description;
        value.duration = task.duration;
        value.complete = task.complete;
        value
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
}