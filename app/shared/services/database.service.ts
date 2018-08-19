import { Injectable } from '@angular/core';
import { Task, compareTask } from '~/shared/models/task';
var Sqlite = require('nativescript-sqlite');

/****************** Begin Table Creation  ********************/

const CreateTasksTable: string = `CREATE TABLE IF NOT EXISTS tasks (
          databaseId INTEGER PRIMARY KEY AUTOINCREMENT, 
          serverId INTEGER, 
          name TEXT NOT NULL,
          description TEXT,
          isRecurring INTEGER,
          weekdays INTEGER,
          creationDate TEXT,
          isCompleted INTEGER,
          completionDate TEXT,
          isDeleted INTEGER,
          ownerEmail TEXT,
          frequency INTEGER,
          teamId INTEGER,
          dirty INTEGER,
          expires TEXT
        )`;

/****************** End Table Creation  **********************/

/****************** Begin SQL Statements **********************/

const QueryUndeletedTasks: string = `SELECT * FROM tasks WHERE isDeleted = 0`;

const InsertTask: string = `INSERT into tasks (
          serverId, 
          name,
          description,
          isRecurring,
          weekdays,
          creationDate,
          isCompleted,
          completionDate,
          isDeleted,
          ownerEmail,
          frequency,
          teamId,
          dirty,
          expires
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

const UpdateTask: string = `UPDATE tasks SET 
          serverId = ?, 
          name = ?,
          description = ?,
          isRecurring = ?,
          weekdays = ?,
          creationDate = ?,
          isCompleted = ?,
          completionDate = ?,
          isDeleted = ?,
          ownerEmail = ?,
          frequency = ?,
          teamId = ?,
          dirty = ?,
          expires = ?
          WHERE databaseId = ?`;

/****************** End SQL Statements *************************/

@Injectable()
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
  /****************** End Database Construction **************/

  /****************** Begin Tasks Methods ********************/

  getTasks(): Task[] {
    let tasks = new Array<Task>();
    // return new Promise((resolve, reject) => {
    this.database.all(QueryUndeletedTasks).then(
      results => {
        console.log('THIS WAS CALLED');
        for (var result of results) {
          let task: Task = new Task();
          task.databaseId = result.databaseId;
          task.id = result.serverId;
          task.name = result.name;
          task.description = result.description;
          task.isRecurring = result.isRecurring === 1 ? true : false;
          task.weekdays = result.weekdays;
          task.creationDate =
            result.creationDate === 'null'
              ? null
              : new Date(result.creationDate);
          task.isCompleted = result.isCompleted === 1 ? true : false;
          task.completionDate =
            result.completionDate === 'null'
              ? null
              : new Date(result.completionDate);
          task.isDeleted = result.isDeleted === 1 ? true : false;
          task.ownerEmail = result.ownerEmail;
          task.frequency = result.frequency;
          task.teamId = result.teamId;
          task.dirty = result.dirty === 1 ? true : false;
          task.expires =
            result.expires === 'null' ? null : new Date(result.expires);
          task.setResetDate();
          tasks.push(task);
        }
        tasks.sort(compareTask);
        console.log(tasks);

        // resolve(tasks);
      },
      error => {
        console.error('database getTasks failed', error);
        return null;
        // reject(error);
      }
    );
    return tasks;
    // });
  }

  insertTask(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database
        .execSQL(InsertTask, [
          task.id,
          task.name,
          task.description,
          task.isRecurring === true ? 1 : 0,
          task.weekdays,
          task.creationDate === null ? 'null' : task.creationDate.toISOString(),
          task.isCompleted === true ? 1 : 0,
          task.completionDate === null
            ? 'null'
            : task.completionDate.toISOString(),
          task.isDeleted === true ? 1 : 0,
          task.ownerEmail,
          task.frequency,
          task.teamId,
          task.dirty === true ? 1 : 0,
          task.expires === null ? 'null' : task.expires.toISOString()
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
          task.id,
          task.name,
          task.description,
          task.isRecurring === true ? 1 : 0,
          task.weekdays,
          task.creationDate === null ? 'null' : task.creationDate.toISOString(),
          task.isCompleted === true ? 1 : 0,
          task.completionDate === null
            ? 'null'
            : task.completionDate.toISOString(),
          task.isDeleted === true ? 1 : 0,
          task.ownerEmail,
          task.frequency,
          task.teamId,
          task.dirty === true ? 1 : 0,
          task.expires === null ? 'null' : task.expires.toISOString(),
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
