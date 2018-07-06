import { Injectable, OnInit } from '@angular/core';
import { Task } from '~/shared/tasks/task';

var Sqlite = require('nativescript-sqlite');
@Injectable({
  providedIn: 'root'
})
export class dataBase implements OnInit {
  private db: any;

  constructor() {
    new Sqlite('tasks.db').then(database => {
      database
        .execSQL(
          'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed INTEGER, note TEXT, duration TEXT)'
        )
        .then(id => {
          this.db = database;
          console.log('DID THIS WORK?');
        }),
        error => {
          console.log(error);
        };
    });
  }

  ngOnInit(): void {}

  fetch(): Array<Task> {
    var tasks = new Array<Task>();

    this.db.all('SELECT * from tasks').then(
      rows => {
        for (var row in rows) {
          var task: Task;
          task = new Task('');
          task.populate(
            rows[row][0],
            rows[row][1],
            rows[row][2],
            rows[row][3],
            rows[row][4]
          );
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
          'INSERT into tasks (description, completed, note, duration) VALUES (?,?,?,?)',
          [
            task.getDescription(),
            task.isComplete(),
            task.getNote(),
            task.getDuration()
          ]
        )
        .then(
          id => {
            console.log('Insert result', id);
            resolve(id);
          },
          error => {
            console.log('Insert error');
            reject(error);
          }
        );
    });
  }
}
