import { Component, OnInit } from '@angular/core';
import { TaskService } from '~/shared/tasks/tasks.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'task-form',
  moduleId: module.id,
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [TaskService]
})
export class TaskFormComponent implements OnInit {
  private tasksService: TaskService;
  private formBuilder: FormBuilder;

  public taskFormGroup: FormGroup;

  constructor(tasksService: TaskService, formBuilder: FormBuilder) {
    this.tasksService = tasksService;
    this.formBuilder = formBuilder;
    this.taskFormGroup = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave() {
    console.log('Description: ' + this.taskFormGroup.value.description);
    this.tasksService.addTask(this.taskFormGroup.value.description);
  }
}
