//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '~/shared/models/account';

@Component({
  selector: 'login-form',
  moduleId: module.id,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  private pageRoute: PageRoute;
  private routerExtensions: RouterExtensions;
  private formBuilder: FormBuilder;

  public accountFormGroup: FormGroup;
  public account: Account;
  public email: string;
  public firstname: string;
  public lastname: string;
  public password: string; //FOR TESTING ONLY! REMOVE SOON

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
    let email = '';
    let firstname = '';
    let lastname = '';
    let password = ''; //TESTING ONLY! REMOVE SOON

    /*if (this.account != null){
      ........
      
    }*/

    this.accountFormGroup = this.formBuilder.group({
      email: [email, Validators.required],
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      password: [password, Validators.required]
    });
  }
}
