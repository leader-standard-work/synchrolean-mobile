import { Component, OnInit } from '@angular/core';

import { Task } from '../../shared/tasks/task';
import { TaskService } from '../../shared/tasks/tasks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'tasks-list',
  moduleId: module.id,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  public tasks$: Observable<Array<Task>>;
  constructor(private tasksService: TaskService) {}

  ngOnInit(): void {
    this.tasks$ = this.tasksService.getTasks();
  }

  public toTaskDetail(item: Task) {
    
  }
}
