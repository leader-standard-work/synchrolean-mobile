import { Injectable, OnInit } from '@angular/core';

import { Task, Duration } from '~/shared/tasks/task';

const serverURL = 'http://localhost:55542';

@Injectable({
  providedIn: 'root'
})
export class ServerService implements OnInit {
  private url: string;
  private userId: number;

  constructor() {}

  ngOnInit() {
    this.url = serverURL;
    this.userId = 123;
  }

  putTask(task: Task) {
      
  }

  getTasks(): Array<Task> {
    return null;
  }
}
