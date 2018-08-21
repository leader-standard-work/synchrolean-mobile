//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular/router';

import { ServerService } from '~/shared/services/server.service';
import { AccountService } from '~/shared/services/account.service';
import { Account } from '~/shared/models/account';

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
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [this.tempUrl, Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signUpTapped() {
    let account = new Account();
    const url = this.accountFormGroup.value.serverUrl;
    account.email = this.accountFormGroup.value.email;
    account.firstName = this.accountFormGroup.value.firstname;
    account.lastName = this.accountFormGroup.value.lastname;
    account.password = this.accountFormGroup.value.password;

    let options = {
      title: 'Could not connect to server',
      okButtonText: 'Ok'
    };

    this.accountService.register(url, account).subscribe(
      response => {
        console.log(response);
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
