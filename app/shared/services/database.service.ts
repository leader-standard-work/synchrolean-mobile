import { Injectable } from '@angular/core';
import { Task } from '~/shared/models/task';
var Sqlite = require('nativescript-sqlite');

let CreateTasksTable: string = `CREATE TABLE IF NOT EXISTS tasks (
            databaseId INTEGER PRIMARY KEY AUTOINCREMENT, 
            serverId INTEGER, 
            name TEXT NOT NULL, 
            description TEXT, 
            duration TEXT, 
            complete INTEGER, 
            completedOn TEXT, 
            resetOn TEXT, 
            created TEXT, 
            updated TEXT, 
            deleted TEXT
          )`;

let CreateCompletionTable: string = `CREATE TABLE IF NOT EXISTS completion (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          taskId INTEGER NOT NULL, 
          completedOn TEXT, 
          FOREIGN KEY(taskId) REFERENCES tasks(databaseId)
        )`;

let CreateAccountTable: string = `CREATE TABLE IF NOT EXISTS account (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          serverUrl Text,
          email TEXT, 
          firstname TEXT,
          lastname TEXT,
          token TEXT 
      )`;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: any;
  constructor() {
    new Sqlite('synchrolean.db').then(
      result => {
        // Create Task Table
        this.database = result;
        this.database.resultType(Sqlite.RESULTSASOBJECT);
        this.database.execSQL(CreateTasksTable).then(
          () => {},
          error => {
            console.log("failed to create tasks table", error);
          }
        );

        // Create Completion Table
        this.database.execSQL(CreateCompletionTable).then(
          () => {},
          error => {
            console.log("failed to create completion table", error);
          }
        );

        // Create Account Table
        this.database.execSQL(CreateAccountTable).then(
          () => {},
          error => {
            console.error("failed to create account table", error);
          }
        );
      },
      error => {
        console.error('failed to create database', error);
      }
    );
  }

  /****************** Tasks  */

  getTasks(): Array<Task> {
    let tasks = new Array<Task>();

    this.database.all('SELECT * from tasks').then(
      rows => {
        for (var row in rows) {
          var task: Task;
          task = new Task('');
          // console.log('Populating');
          task.populate(
            rows[row][0],
            rows[row][1],
            rows[row][2],
            rows[row][3],
            rows[row][4],
            rows[row][5]
          );

          // console.log('Pushing task');
          tasks.push(task);
        }
      },
      error => {
        console.log('Fetch tasks error\n');
        return null;
      }
    );
    return tasks;
  }

  insert(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db
        .execSQL(
          'INSERT into tasks (description, completed, note, duration, date) VALUES (?,?,?,?,?)',
          [
            task.getDescription(),
            task.isComplete(),
            task.getNote(),
            task.getDuration(),
            task.getDateStr()
          ]
        )
        .then(
          id => {
            // console.log('Insert result', id);
            resolve(id);
          },
          error => {
            console.log('Insert error');
            reject(error);
          }
        );
    });
  }

  update(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db
        .execSQL(
          'UPDATE tasks SET description = ?, completed = ?, note = ?, duration = ?, date = ? WHERE id = ?',
          [
            task.getDescription(),
            task.isComplete(),
            task.getNote(),
            task.getDuration(),
            task.getDate(),
            task.getId()
          ]
        )
        .then(
          id => {
            resolve(id);
          },
          error => {
            console.log('Update error');
            reject(error);
          }
        );
    });
  }
}
