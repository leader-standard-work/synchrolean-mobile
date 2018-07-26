//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '~/shared/models/account';

@Component({
  selector: 'login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private pageRoute: PageRoute;
  private routerExtensions: RouterExtensions;
  private formBuilder: FormBuilder;

  public accountFormGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    pageRoute: PageRoute,
    routerExtensions: RouterExtensions
  ) {
    this.formBuilder = formBuilder;
    this.pageRoute = pageRoute;
    this.routerExtensions = routerExtensions;

    //this.pageRoute.activatedRoute ...
  }

  ngOnInit(): void {
    let url = '';
    let email = '';
    let password = '';

    /*if (this.account != null){
      ........
      
    }*/

    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [url, Validators.required],
      email: [email, Validators.required],
      password: [password, Validators.required]
    });
  }

  login() {
    
  }
}
