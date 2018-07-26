//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '~/shared/models/account';

@Component({
  selector: 'register',
  moduleId: module.id,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
    let firstname = '';
    let lastname = '';
    let password = '';

    /*if (this.account != null){
      ........
      
    }*/

    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [url, Validators.required],
      email: [email, Validators.required],
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      password: [password, Validators.required]
    });
  }
}
