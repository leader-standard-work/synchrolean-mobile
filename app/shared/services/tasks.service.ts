import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { DatabaseService } from '~/shared/services/database.service';
import { Task, compareTask, Frequency } from '~/shared/models/task';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '~/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[];
  private tasksSubject: BehaviorSubject<Task[]>;
  private tasksObservable: Observable<Task[]>;

  constructor(
    private databaseService: DatabaseService,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {
    this.tasks = new Array<Task>();
    this.tasksSubject = new BehaviorSubject([]);
    this.tasksObservable = this.tasksSubject.asObservable();
    this.tasksObservable = this.fetchTasks();
  }

  fetchTasks(): Observable<Task[]> {
    // this.databaseService.getTasks().then(
    this.tasks = this.databaseService.getTasks();
    console.log(this.tasks);
    // tasks => {
    // this.tasks = tasks;
    if (this.authService.isLoggedIn) {
      this.getServerTasks().subscribe(
        //Response is the list of tasks from the server
        response => {
          this.tasks.forEach(function(dbTask, localIndex) {
            let foundIndex = response.findIndex(function(task) {
              return task.id === dbTask.id;
            });
            let found = response[foundIndex];
            if (found === undefined) {
              //Not on the server, delete the task if it has server id
              //if(dbTask.serverId != undefined) ...
              if (dbTask.id !== -1) {
                this.deleteTask(dbTask.databaseId);
              } else {
                this.addServerTask(dbTask).subscribe(
                  response => {
                    dbTask.id = response.id;
                  },
                  error => {
                    console.error('could not add to task', error);
                  }
                );
              }
            } else {
              //is on the server, do the dirty check
              if (dbTask.dirty) {
                this.editServerTask(dbTask).subscribe(
                  () => {
                    dbTask.dirty = false;
                  },
                  error => {
                    console.error('could not update server task', error);
                  }
                );
              } else if (dbTask.compare(found)) {
                let newTask = new Task(found);
                //Write changed task to local db
                this.tasks.splice(localIndex, 1);
                this.tasks.push(newTask);
              }
            }
          });
          for (let task of response) {
            let found = this.tasks.find(dbTask => dbTask.id === task.id);
            if (found === undefined) {
            }
          }
          this.tasksSubject.next(this.tasks);
        },
        error => {
          console.error('could not get tasks from server', error);
        }
      );
    } else {
      this.tasksSubject.next(this.tasks);
    }
    // },
    //   reject => {
    //     console.error('could not get tasks from database', reject);
    //   }
    // );
    return this.tasksObservable;
  }

  public getTasks(): Observable<Task[]> {
    // this.tasks = this.databaseService.getTasks();
    console.log(this.tasks);
    return this.tasksObservable;
  }

  public getUpdatedTasks(): Observable<Task[]> {
    this.tasks.sort(compareTask);
    this.tasksSubject.next(this.tasks);
    return this.tasksObservable;
  }

  public addTask(task: Task): void {
    task.ownerEmail = this.authService.email;
    this.addServerTask(task).subscribe(
      response => {
        console.log(response);
        task.id = response.id;
        this.addDatabaseTask(task);
      },
      error => {
        console.error('could not add task to server', error);
        this.addDatabaseTask(task);
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
        value.id = task.id;
        value.name = task.name;
        value.description = task.description;
        value.isRecurring = task.isRecurring;
        value.weekdays = task.weekdays;
        value.creationDate = task.creationDate;
        value.isCompleted = task.isCompleted;
        value.completionDate = task.completionDate;
        value.isDeleted = task.isDeleted;
        value.ownerEmail = task.ownerEmail;
        value.frequency = task.frequency;
        value.teamId = task.teamId;
        value.dirty = true;
        value.expires = task.expires;
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
        item.isDeleted = true;
        item.dirty = true;
        this.tasks.splice(index, 1);
        this.databaseService.updateTask(item);
      }
    });
  }

  public checkTask(task: Task) {
    this.tasks.forEach((item, index) => {
      if (item.databaseId === task.databaseId) {
        item.isCompleted = task.isCompleted;
        this.databaseService.updateTask(item);
        console.log(item);
      }
    });
  }

  taskReset() {
    this.tasks.forEach(task => {
      let today = new Date();
      if (task.frequency === Frequency.Once) {
        task.delete();
      }
      if (task.expires < today) {
        task.setResetDate();
        task.isCompleted = false;
      }
    });
    this.tasks.sort(compareTask);
  }

  //this is after refeactor
  getuserTodo(email: string): Observable<Task[]> {
    let endpoint = this.authService.url + '/api/tasks/todo/' + email;
    return this.http.get<Task[]>(endpoint);
  }

  getServerTasks(): Observable<Task[]> {
    let endpoint =
      this.authService.url + '/api/tasks/' + this.authService.email;
    return this.http.get<Task[]>(endpoint);
  }

  addDatabaseTask(task: Task) {
    this.databaseService.insertTask(task).then(
      id => {
        task.databaseId = id;
        this.tasks.push(task);
        this.tasks.sort(compareTask);
      },
      error => {
        console.error('could not add task to database ', error);
      }
    );
  }

  addServerTask(task: Task) {
    let endpoint = this.authService.url + '/api/tasks';
    let body = {
      name: task.name,
      description: task.description,
      isRecurring: task.isRecurring,
      weekdays: task.weekdays,
      creationDate: task.creationDate,
      isCompleted: task.isCompleted,
      completionDate: task.completionDate,
      isDeleted: task.isDeleted,
      ownerEmail: task.ownerEmail,
      frequency: task.frequency,
      teamId: task.teamId === -1 ? null : task.teamId
    };
    console.log(body);
    return this.http.post<Task>(endpoint, body);
  }

  editServerTask(task: Task) {
    let endpoint = this.authService.url + '/api/tasks/' + task.id;
    return this.http.put(endpoint, task);
  }
}
