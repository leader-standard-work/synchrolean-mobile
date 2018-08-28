import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { DatabaseService } from '~/shared/services/database.service';
import { Task, compareTask, Frequency } from '~/shared/models/task';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '~/shared/services/auth.service';

@Injectable()
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
        let deletedTasks = tasks.filter(
          task => task.isDeleted && task.id !== -1
        );
        this.tasks = tasks.filter(task => !task.isDeleted);

        if (this.authService.isLoggedIn()) {
          this.getServerTasks().subscribe(
            serverTasks => {
              //task found locally but not on server
              this.tasks.forEach((task, index) => {
                if (task.id === -1) {
                  this.addServerTask(task).subscribe(
                    response => {
                      this.tasks[index].dirty = false;
                      this.tasks[index].id = response.id;
                      this.editDatabaseTask(this.tasks[index]);
                    },
                    error => {
                      console.error(
                        'could not add offline tasks to server',
                        error
                      );
                    }
                  );
                } else {
                  let found = serverTasks.find(t => t.id === task.id);
                  if (found === undefined) {
                    this.tasks[index].isDeleted = true;
                    this.tasks[index].dirty = false;
                    this.databaseService.updateTask(this.tasks[index]);
                    this.tasks.splice(index, 1);
                  } else if (!task.compare(found) && !task.dirty) {
                    let newTask = new Task(found);
                    newTask.databaseId = task.databaseId;
                    newTask.ownerEmail = this.authService.email;
                    this.editDatabaseTask(newTask);
                  } else if (task.dirty) {
                    this.editServerTask(task).subscribe(
                      () => {
                        this.tasks[index].dirty = false;
                        this.editDatabaseTask(this.tasks[index]);
                      },
                      error => {
                        console.error(
                          'could not edit task on the server',
                          error
                        );
                      }
                    );
                  }
                }
              });

              // delete tasks form server if deleted locally
              deletedTasks.forEach(task => {
                let found = serverTasks.find(t => t.id === task.id);
                if (found !== undefined) {
                  this.editServerTask(task).subscribe(
                    () => {
                      task.dirty = false;
                      this.databaseService.updateTask(task);
                    },
                    error => {
                      console.error(
                        'could not delete task on server',
                        task,
                        error
                      );
                    }
                  );
                } else {
                  task.dirty = false;
                  this.databaseService.updateTask(task);
                }
              });

              serverTasks.forEach(task => {
                // search for server task in local list
                let found = this.tasks.find(dbTask => dbTask.id === task.id);
                // server task is not found in local tasks
                if (found === undefined) {
                  let newTask = new Task(task);
                  newTask.ownerEmail = this.authService.email;
                  console.log(newTask);
                  this.addDatabaseTask(newTask);
                }
              });

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
      error => {
        console.error('could not fetch all tasks from database', error);
      }
    );
    return this.tasksObservable;
  }

  // fetchTasks(): Observable<Task[]> {
  //   this.databaseService.getTasks().then(
  //     tasks => {
  //       this.tasks = tasks;
  //       if (this.authService.isLoggedIn()) {
  //         this.getServerTasks().subscribe(
  //           response => {
  //             response.forEach(task => {
  //               // search for server task in local list
  //               let found = this.tasks.find(dbTask => dbTask.id === task.id);
  //               // server task is not found in local tasks
  //               // TODO: This is a bug where locally deleted tasks offline will get recreated.
  //               if (found === undefined) {
  //                 let newTask = new Task(task);
  //                 console.log(newTask);
  //                 this.addDatabaseTask(newTask);
  //               }
  //             });

  //             this.tasks.forEach((dbTask, localIndex) => {
  //               // search for local task in server tasks
  //               let found = response.find(task => task.id === dbTask.id);

  //               // local task is not found in server tasks
  //               if (found === undefined) {
  //                 if (dbTask.id === -1) {
  //                   this.addServerTask(dbTask).subscribe(
  //                     response => {
  //                       this.tasks[localIndex].id = response.id;
  //                       this.editDatabaseTask(dbTask);
  //                     },
  //                     error => {
  //                       console.error(
  //                         'could not add to task: ',
  //                         dbTask.databaseId,
  //                         error
  //                       );
  //                     }
  //                   );
  //                 } else {
  //                   // Delete task
  //                   this.tasks[localIndex].isDeleted = true;
  //                   this.tasks[localIndex].dirty = false;
  //                   this.databaseService.updateTask(this.tasks[localIndex]);
  //                   this.tasks.splice(localIndex, 1);
  //                   this.tasksSubject.next(this.tasks);
  //                 }
  //               } else {
  //                 // local task is in server tasks
  //                 if (dbTask.dirty) {
  //                   this.editServerTask(dbTask).subscribe(
  //                     () => {
  //                       dbTask.dirty = false;
  //                     },
  //                     error => {
  //                       console.error('could not update server task', error);
  //                     }
  //                   );
  //                 } else if (!dbTask.compare(found)) {
  //                   let newTask = new Task(found);
  //                   newTask.ownerEmail = this.authService.email;
  //                   this.editDatabaseTask(newTask);
  //                 }
  //               }
  //             });

  //             this.tasksSubject.next(this.tasks);
  //           },
  //           error => {
  //             console.error('could not get tasks from server', error);
  //           }
  //         );
  //       } else {
  //         this.tasksSubject.next(this.tasks);
  //       }
  //     },
  //     reject => {
  //       console.error('could not get tasks from database', reject);
  //     }
  //   );
  //   return this.tasksObservable;
  // }

  public getTasks(): Observable<Task[]> {
    return this.fetchTasks();
  }

  public getUpdatedTasks(): Observable<Task[]> {
    this.tasks.sort(compareTask);
    this.tasksSubject.next(this.tasks);
    return this.tasksObservable;
  }

  public getTaskById(id: number): Task {
    for (let task of this.tasks) {
      if (task.databaseId === id) {
        return task;
      }
    }
    return null;
  }

  public addTask(task: Task): void {
    task.ownerEmail = this.authService.email;
    task.dirty = true;
    if (this.authService.isLoggedIn()) {
      this.addServerTask(task).subscribe(
        response => {
          task.dirty = false;
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

  public updateTask(task: Task) {
    let index = this.tasks.findIndex(
      item => item.databaseId === task.databaseId
    );
    if (index === -1) {
      return;
    }

    this.tasks[index].dirty = true;
    if (this.authService.isLoggedIn() && this.tasks[index].id !== -1) {
      this.editServerTask(task).subscribe(
        () => {
          this.tasks[index].dirty = false;
          this.editDatabaseTask(task);
        },
        error => {
          console.error('could not edit task on server', error);
          this.editDatabaseTask(task);
        }
      );
    } else {
      this.editDatabaseTask(task);
    }
  }

  public deleteTask(id: number) {
    let index = this.tasks.findIndex(task => task.databaseId === id);
    if (index < 0) {
      console.error('could not find task to delete index:', index);
      return;
    }
    this.tasks[index].isDeleted = true;
    if (this.tasks[index].id === -1) {
      this.tasks[index].dirty = false;
    } else {
      this.tasks[index].dirty = true;
    }
    if (this.authService.isLoggedIn() && this.tasks[index].id !== -1) {
      this.editServerTask(this.tasks[index]).subscribe(
        () => {
          this.tasks[index].dirty = false;
          this.databaseService.updateTask(this.tasks[index]);
        },
        error => {
          console.error(
            'could not delete task on server',
            this.tasks[index],
            error
          );
          this.databaseService.updateTask(this.tasks[index]);
        }
      );
    } else {
      this.databaseService.updateTask(this.tasks[index]);
    }
    this.tasks.splice(index, 1);
    this.tasksSubject.next(this.tasks);
  }

  public checkTask(task: Task) {
    console.log(task);
    let index = this.tasks.findIndex(
      item => item.databaseId === task.databaseId
    );
    if (index < 0) {
      return;
    }
    this.tasks[index].isCompleted = task.isCompleted;
    this.tasks[index].completionDate = task.isCompleted ? new Date() : null;
    this.tasks[index].dirty = true;
    if (this.authService.isLoggedIn() && this.tasks[index].id !== -1) {
      this.editServerTask(this.tasks[index]).subscribe(
        () => {
          this.tasks[index].dirty = false;
          this.databaseService.updateTask(this.tasks[index]);
        },
        error => {
          console.error(
            'could not set task to: ',
            this.tasks[index].isCompleted,
            ' on the server',
            error
          );
          this.databaseService.updateTask(this.tasks[index]);
        }
      );
    } else {
      this.databaseService.updateTask(this.tasks[index]);
    }
  }

  taskReset() {
    this.tasks.forEach(task => {
      let today = new Date();
      if (task.frequency === Frequency.Once) {
        this.deleteTask(task.databaseId);
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

  addServerTask(task: Task): Observable<Task> {
    let endpoint = this.authService.url + '/api/tasks';
    let body =
      task.teamId === -1
        ? {
            name: task.name,
            description: task.description,
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
          () => {},
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
