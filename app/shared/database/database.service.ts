import { Injectable, OnInit } from '@angular/core';
import { Task } from '~/shared/tasks/task';
var Sqlite = require('nativescript-sqlite');

@Injectable({
  providedIn: 'root'
})
export class DBService implements OnInit {
  private db: any;

  constructor() {
    new Sqlite('tasks.db').then(database => {
      database
        .execSQL(
          'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed INTEGER, note TEXT, duration TEXT, date TEXT)'
        )
        .then(id => {
          this.db = database;
          //make user table
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
          console.log('Populating');
          task.populate(
            rows[row][0],
            rows[row][1],
            rows[row][2],
            rows[row][3],
            rows[row][4],
            rows[row][5]
          );

          console.log('Pushing task');
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
