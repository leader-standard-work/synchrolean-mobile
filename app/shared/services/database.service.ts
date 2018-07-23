import { Injectable } from '@angular/core';
import { Task, compareTask } from '~/shared/models/task';
var Sqlite = require('nativescript-sqlite');

/****************** Begin Table Creation  ********************/

const CreateTasksTable: string = `CREATE TABLE IF NOT EXISTS tasks (
          databaseId INTEGER PRIMARY KEY AUTOINCREMENT, 
          serverId INTEGER, 
          name TEXT NOT NULL, 
          description TEXT, 
          duration TEXT, 
          complete INTEGER, 
          completedOn TEXT, 
          expires TEXT, 
          created TEXT, 
          updated TEXT, 
          deleted TEXT
        )`;

const CreateCompletionTable: string = `CREATE TABLE IF NOT EXISTS completion (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          taskId INTEGER NOT NULL, 
          completedOn TEXT, 
          FOREIGN KEY(taskId) REFERENCES tasks(databaseId)
        )`;

const CreateAccountTable: string = `CREATE TABLE IF NOT EXISTS account (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          serverUrl Text,
          email TEXT, 
          firstname TEXT,
          lastname TEXT,
          token TEXT 
        )`;
/****************** End Table Creation  **********************/

/****************** Begin Task SQL  **************************/

const QueryUndeletedTasks: string = `SELECT * FROM tasks WHERE deleted = 'null'`;

const InsertTask: string = `INSERT into tasks (
          serverId, 
          name, 
          description, 
          duration, 
          complete, 
          completedOn, 
          expires, 
          created, 
          updated, 
          deleted
) VALUES (?,?,?,?,?,?,?,?,?,?)`;

const UpdateTask: string = `UPDATE tasks SET 
          serverId = ?, 
          name = ?, 
          description = ?, 
          duration = ?, 
          complete = ?, 
          completedOn = ?, 
          expires = ?, 
          created = ?, 
          updated = ?, 
          deleted = ?
          WHERE databaseId = ?`;

/****************** End Task SQL  ****************************/
/****************** Begin   SQL  **************************/
/****************** End SQL  **************************/

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
            console.log('failed to create tasks table', error);
          }
        );

        // Create Completion Table
        this.database.execSQL(CreateCompletionTable).then(
          () => {},
          error => {
            console.log('failed to create completion table', error);
          }
        );

        // Create Account Table
        this.database.execSQL(CreateAccountTable).then(
          () => {},
          error => {
            console.error('failed to create account table', error);
          }
        );
      },
      error => {
        console.error('failed to create database', error);
      }
    );
  }

  /****************** Begin Tasks Methods ********************/

  getTasks(): Array<Task> {
    let tasks = new Array<Task>();

    this.database.all(QueryUndeletedTasks).then(
      results => {
        for (var result of results) {
          let task: Task = new Task('');
          task.populateFromDB(
            result.databaseId,
            result.serverId,
            result.name,
            result.description,
            result.duration,
            result.complete,
            result.completedOn,
            result.expires,
            result.created,
            result.updated,
            result.deleted
          );
          tasks.push(task);
        }
        tasks.sort(compareTask);
      },
      error => {
        console.error('database getTasks failed', error);
        return null;
      }
    );
    return tasks;
  }

  insertTask(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database
        .execSQL(InsertTask, [
          task.serverId,
          task.name,
          task.description,
          task.duration,
          task.complete === true ? 1 : 0,
          task.completedOn === null ? 'null' : task.completedOn.toISOString(),
          task.expires === null ? 'null' : task.expires.toISOString(),
          task.created === null ? 'null' : task.created.toISOString(),
          task.updated === null ? 'null' : task.updated.toISOString(),
          task.deleted === null ? 'null' : task.deleted.toISOString()
        ])
        .then(
          id => {
            resolve(id);
          },
          error => {
            console.error('insert task into database failed', error);
            reject(error);
          }
        );
    });
  }

  updateTask(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database
        .execSQL(UpdateTask, [
          task.serverId,
          task.name,
          task.description,
          task.duration,
          task.complete === true ? 1 : 0,
          task.completedOn === null ? 'null' : task.completedOn.toISOString(),
          task.expires === null ? 'null' : task.expires.toISOString(),
          task.created === null ? 'null' : task.created.toISOString(),
          task.updated === null ? 'null' : task.updated.toISOString(),
          task.deleted === null ? 'null' : task.deleted.toISOString(),
          task.databaseId
        ])
        .then(
          id => {
            resolve(id);
          },
          error => {
            console.error('update task in database failed', error);
            reject(error);
          }
        );
    });
  }
  /****************** End Tasks Methods **********************/

  /****************** Begin Complete Methods *****************/
  /****************** End Complete Methods *******************/

  /****************** Begin Account Methods ******************/
  /****************** End Account Methods ********************/
}
