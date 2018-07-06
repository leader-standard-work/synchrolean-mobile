import { Injectable, OnInit } from '@angular/core';
import { Task } from '~/shared/tasks/task';


var Sqlite = require( "nativescript-sqlite");
@Injectable({
    providedIn: 'root'
  })

  export class dataBase implements OnInit {
    private db: any;

    constructor(){
        this.db = new Sqlite('tasks.db', function(err, db) {
            if (err) {
              console.error("We failed to open database", err);
            } else {
                db.execSQL("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed INTEGER, note TEXT, duration TEXT)",
                function(err){
                    if(err){
                        console.log("tasks table already exists")
                    }else{
                        console.log("tasks table created");
                    } 
                });
              // This should ALWAYS be true, db object is open in the "Callback" if no errors occurred
              console.log("Are we open yet (Inside Callback)? ", db.isOpen() ? "Yes" : "No"); // Yes
            }
        });

    }

    ngOnInit(): void {}

    fetch(): Array<Task>{
        var tasks = new Array<Task>();

        this.db = new Sqlite('tasks.db', function(err, db){
            if(err){
                console.log("Error opening tasks in fetch")
            }else{
                db.all("SELECT * from tasks", 
                function(err, rows){
                    if(err){
                        console.log("Fetch tasks error\n");
                        return null;
                    }
                    else{
                        for(var row in rows){
                            var task : Task;
                            task = new Task("");
                            task.populate(rows[row][0], rows[row][1], rows[row][2], rows[row][3], rows[row][4]);
                            tasks.push(task);
                        }
                    }
                }
        )}})

        return tasks;
        /*this.db = new Sqlite('tasks.db', function(err, db){

        })
        
        this.db.execSQL("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed INTEGER, note TEXT, duration TEXT)",
            function(err, id){
                console.log("tasks table created");
            });*/
    }

    insert(task: Task){
        this.db = new Sqlite('tasks.db', function(err, db){
                if(err){
                    console.log('Error opening db in insert')
                }else{
                    db.execSQL("INSERT into tasks (description, completed, note, duration) VALUES (?,?,?,?)", 
                        [task.getDescription(), task.isComplete(), task.getNote(), task.getDuration()],
                        function(err, id){
                            if(err){
                                console.log("Insert error");
                            }else{
                                console.log("Insert result", id);
                            }
                        })
                }
            })

    }

  }