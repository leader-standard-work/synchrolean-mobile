import { Injectable, OnInit } from '@angular/core';
var Sqlite = require("nativescript-sqlite").promise;

import { Task } from './task';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {
  private database: any;
  public tasks: Array<any>;
  public task: Task;

  public constructor() {  
      this.task = null;
      this.tasks = [];
      this.database = new Sqlite("my.db", function(err, db){
        if(err){
          console.error('Database failed to open', err);
        } else{
          console.log('Db Open');
        }
      })
      this.tasks = this.getTasks();
  }
ngOnInit(): void {
  this.task = null;
  this.tasks = [];
  (new Sqlite("my.db")).then(db => {
      db.execSQL("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT, complete BOOL)").then(id => {
          this.database = db;
      }, error => {
          console.log("CREATE TABLE ERROR", error);
      });
  }, error => {
      console.log("OPEN DB ERROR", error);
  });
  this.tasks = this.getTasks();
}

  public insert() {
    this.database.execSQL("INSERT INTO tasks (info, complete) VALUES (?, ?)", [this.task.getDescription(), this.task.isComplete()]).then(id => {
        console.log("INSERT RESULT", id);
    }, error => {
        console.log("INSERT ERROR", error);
    });
}

  public fetch(){
      this.database.all("SELECT * FROM tasks").then(rows => {
          this.tasks = [];
          this.task = new Task("");
          for(var row in rows) {
              this.task.populate(rows[row][1], rows[row][2], rows[row][3]);
              if(this.task.isComplete){
                this.tasks.push(this.task);
                this.task = new Task("");
              }
          }
      }, error => {
          console.log("SELECT ERROR", error);
      });
  }


  public getTasks(): Array<Task> {
    this.fetch();
    return this.tasks;
  }

  public addTask(description: string): void {
    //change to insert
    this.task = new Task(description);
    this.insert();
    
    for(let taskt of this.tasks)
      {console.log(this.tasks[taskt])};
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
    /*private tasks: Array<Task>;

  constructor() {
    //sql
    this.tasks = new Array<Task>();
  }

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
  }*/
}
