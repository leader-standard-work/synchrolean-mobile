import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '~/shared/tasks/task';

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
    let TASK: string = '{"name" : "This is a post task", "ownerId" : 0}';
    this.http.post(postUrl, TASK).pipe(
      map(response => {
        let res = response.json;
        console.log(res);
      })
    );
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
