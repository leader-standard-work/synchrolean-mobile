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
  }

  fetchTasks(): Observable<Task[]> {
    this.databaseService.getTasks().then(
      tasks => {
        this.tasks = tasks;
        if (this.authService.isLoggedIn()) {
          this.getServerTasks().subscribe(
            response => {
              this.tasks.forEach((dbTask, localIndex) => {
                // search for local task in server tasks
                let found = response.find(task => task.id === dbTask.id);

                // local task is not found in server tasks
                if (found === undefined) {
                  if (dbTask.id === -1) {
                    this.addServerTask(dbTask).subscribe(
                      response => {
                        dbTask.id = response.id;
                        this.editDatabaseTask(dbTask);
                      },
                      error => {
                        console.error('could not add to task', error);
                      }
                    );
                  } else {
                    this.deleteTask(dbTask.databaseId);
                  }
                } else {
                  // local task is in server tasks
                  if (dbTask.dirty) {
                    this.editServerTask(dbTask).subscribe(
                      () => {
                        dbTask.dirty = false;
                      },
                      error => {
                        console.error('could not update server task', error);
                      }
                    );
                  } else if (!dbTask.compare(found)) {
                    let newTask = new Task(found);
                    newTask.ownerEmail = this.authService.email;
                    this.editDatabaseTask(newTask);
                  }
                }
              });

              for (let task of response) {
                // search for server task in local list
                let found = this.tasks.find(dbTask => dbTask.id === task.id);
                // server task is not found in local tasks
                // TODO: This is a bug where locally deleted tasks offline will get recreated.
                if (found === undefined) {
                  let newTask = new Task(task);
                  this.addDatabaseTask(newTask);
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
      },
      reject => {
        console.error('could not get tasks from database', reject);
      }
    );
    return this.tasksObservable;
  }

  public getTasks(): Observable<Task[]> {
    return this.fetchTasks();
  }

  public getUpdatedTasks(): Observable<Task[]> {
    this.tasks.sort(compareTask);
    this.tasksSubject.next(this.tasks);
    return this.tasksObservable;
  }

  public addTask(task: Task): void {
    task.ownerEmail = this.authService.email;
    if (this.authService.isLoggedIn()) {
      this.addServerTask(task).subscribe(
        response => {
          task.id = response.id;
          this.addDatabaseTask(task);
        },
        error => {
          console.error('could not add task to server', error);
          this.addDatabaseTask(task);
        }
      );
    } else {
      this.addDatabaseTask(task);
    }
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
    let index = this.tasks.findIndex(
      item => item.databaseId === task.databaseId
    );
    if (index === -1) {
      return;
    }
    if (this.authService.isLoggedIn()) {
      this.editServerTask(task).subscribe(
        () => {
          this.tasks[index].dirty = false;
          this.editDatabaseTask(task);
        },
        error => {
          console.error('could not edit task on server', error);
        }
      );
    } else {
      this.tasks[index].dirty = true;
      this.editDatabaseTask(task);
    }
  }

  public deleteTask(id: number) {
    let index = this.tasks.findIndex(task => task.databaseId === id);
    if (index < 0) {
      return;
    }
    this.tasks[index].isDeleted = true;
    this.tasks[index].dirty = true;
    if (this.authService.isLoggedIn()) {
      this.editServerTask(this.tasks[index]).subscribe(
        () => {
          this.tasks[index].dirty = false;
          this.databaseService.updateTask(this.tasks[index]);
        },
        error => console.error('could not delete task on server', error)
      );
    } else {
      this.databaseService.updateTask(this.tasks[index]);
    }
    this.tasks.splice(index, 1);
    this.tasksSubject.next(this.tasks);
  }

  public checkTask(task: Task) {
    let index = this.tasks.findIndex(
      item => item.databaseId === task.databaseId
    );
    if (index < 0) {
      return;
    }
    this.tasks[index].isCompleted = task.isCompleted;
    this.tasks[index].completionDate = task.isCompleted ? new Date() : null;
    if (this.authService.isLoggedIn()) {
      this.editServerTask(this.tasks[index]).subscribe(
        () => {},
        error => {
          console.error(
            'could not set task to: ',
            this.tasks[index].isCompleted,
            ' on the server',
            error
          );
        }
      );
    }
    this.databaseService.updateTask(this.tasks[index]);
    console.log(this.tasks[index]);
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
        this.tasksSubject.next(this.tasks);
      },
      error => {
        console.error('could not add task to database ', error);
      }
    );
  }

  addServerTask(task: Task) {
    console.log(task);
    let endpoint = this.authService.url + '/api/tasks';
    let body =
      task.teamId === -1
        ? {
            name: task.name,
            description: task.description,
            isRecurring: task.isRecurring,
            weekdays: task.weekdays,
            creationDate: task.creationDate,
            isCompleted: task.isCompleted,
            completionDate: task.completionDate,
            isDeleted: task.isDeleted,
            ownerEmail: this.authService.email,
            frequency: task.frequency
          }
        : {
            name: task.name,
            description: task.description,
            isRecurring: task.isRecurring,
            weekdays: task.weekdays,
            creationDate: task.creationDate,
            isCompleted: task.isCompleted,
            completionDate: task.completionDate,
            isDeleted: task.isDeleted,
            ownerEmail: this.authService.email,
            frequency: task.frequency,
            teamId: task.teamId
          };
    return this.http.post<Task>(endpoint, body);
  }

  editDatabaseTask(task: Task) {
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

  editServerTask(task: Task) {
    let body =
      task.teamId === -1
        ? {
            name: task.name,
            description: task.description,
            isRecurring: task.isRecurring,
            weekdays: task.weekdays,
            creationDate: task.creationDate,
            isCompleted: task.isCompleted,
            completionDate: task.completionDate,
            isDeleted: task.isDeleted,
            ownerEmail: this.authService.email,
            frequency: task.frequency
          }
        : {
            name: task.name,
            description: task.description,
            isRecurring: task.isRecurring,
            weekdays: task.weekdays,
            creationDate: task.creationDate,
            isCompleted: task.isCompleted,
            completionDate: task.completionDate,
            isDeleted: task.isDeleted,
            ownerEmail: this.authService.email,
            frequency: task.frequency,
            teamId: task.teamId
          };
    let endpoint = this.authService.url + '/api/tasks/' + task.id;
    return this.http.put(endpoint, body);
  }
}
