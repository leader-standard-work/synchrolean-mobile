import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '~/shared/tasks/task';
import { ServerTask } from '~/shared/tasks/serverTask';

const serverURL = 'http://localhost:55542';

@Injectable({
  providedIn: 'root'
})
export class ServerService implements OnInit {
  private http: Http;
  private url: string;
  private userId: number;

  constructor(http: Http) {
    this.http = http;
  }

  ngOnInit() {
    this.url = serverURL;
    this.userId = 0;
  }

  postTask(task: Task) {
    let postUrl: string = this.url + '/api/tasks';
    let postTask = new ServerTask(task, this.userId);

    this.http.post(postUrl, postTask).pipe(
      map(response => {
        if (!response.ok) {
          console.log('POST FAILED');
          return;
        }
        let res = response.json.toString();
        if (task.getServerId() === -1) {
          let obj = JSON.parse(res);
          task.setServerId(obj.id);
        }
        console.log(res);
      })
    );
  }

  postTasks(tasks: Task[]) {
    tasks.forEach(task => {
      this.postTask(task);
    });
  }

  getTasks(): Observable<Task[]> {
    let getUrl: string = this.url + '/api/tasks/' + this.userId;
    this.http.get(getUrl).pipe(
      map(response => {
        let res = response.json;
        console.log(res);
      })
    );
    return null;
  }
}
