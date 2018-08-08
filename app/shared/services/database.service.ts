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

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: any;

  /****************** Begin Database Construction ************/

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
      },
      error => {
        console.error('failed to create database', error);
      }
    );
  }
  /****************** End Database Creation ******************/

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
          count => {
            resolve(count);
          },
          error => {
            console.error('update task in database failed', error);
            reject(error);
          }
        );
    });
  }
}
/****************** End Tasks Methods **********************/
