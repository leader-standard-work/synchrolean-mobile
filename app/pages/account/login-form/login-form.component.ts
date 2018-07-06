//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'login-form',
    moduleId: module.id,
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css'],
  })
  export class LoginFormComponent implements OnInit {


  

  ngOnInit(): void{}
}