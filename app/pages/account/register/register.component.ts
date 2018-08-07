//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular/router';

import { ServerService } from '~/shared/services/server.service';
import { AccountService } from '~/shared/services/account.service';

@Component({
  selector: 'register',
  moduleId: module.id,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public accountFormGroup: FormGroup;

  public tempUrl: string = 'http://localhost:55542';

  constructor(
    private serverService: ServerService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    let url = '';
    let email = '';
    let firstname = '';
    let lastname = '';
    let password = '';

    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [this.tempUrl, Validators.required],
      email: [
        email,
        Validators.compose([Validators.required, Validators.email])
      ],
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      password: [password, Validators.required]
    });
  }

  signUpTapped() {
    let url = this.accountFormGroup.value.serverUrl;
    let email = this.accountFormGroup.value.email;
    let firstname = this.accountFormGroup.value.firstname;
    let lastname = this.accountFormGroup.value.lastname;
    let password = this.accountFormGroup.value.password;

    let options = {
      title: 'Could not connect to server',
      okButtonText: 'Ok'
    };

    this.serverService
      .register(url, email, password, firstname, lastname)
      .subscribe(
        account => {
          console.log(account);
          account.serverUrl = url;      //this is ugly but is needed in user settings
          this.accountService.account = account;
          this.routerExtensions.navigate(['/login'], {
            clearHistory: true,
            transition: {
              name: 'slideRight'
            }
          });
        },
        error => {
          alert(options);
        }
      );
  }
}
