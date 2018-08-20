//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '~/shared/services/auth.service';
import { AccountService } from '~/shared/services/account.service';

@Component({
  selector: 'login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public accountFormGroup: FormGroup;
  public tempUrl: string = 'http://10.0.2.2:55542';

  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    let url = '';
    let email = '';
    let password = '';

    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [this.tempUrl, Validators.required],
      email: [
        email,
        Validators.compose([Validators.required, Validators.email])
      ],
      password: [password, Validators.required]
    });
  }

  loginTapped() {
    let url = this.accountFormGroup.value.serverUrl;
    let email = this.accountFormGroup.value.email;
    let password = this.accountFormGroup.value.password;

    this.authService.login(url, email, password).subscribe(
      response => {
        let { token } = response;
        this.authService.setSession(url, email, token);
        this.accountService.getAccountByEmail(email).subscribe(
          account => {
            this.accountService.account = account;
            this.routerExtensions.navigate(['/account'], {
              clearHistory: true,
              transition: { name: 'slideRight' }
            });
          },
          error => {
            console.error(`could not get account for '${email}, ${error}`);
          }
        );
      },
      error => {
        console.error('could not login "', email, '" :', error);
      }
    );
  }

  tasksTapped() {
    this.routerExtensions.navigate(['/task-list'], {
      clearHistory: true,
      animated: false
    });
  }

  metricsTapped() {
    this.routerExtensions.navigate(['/metrics'], {
      clearHistory: true,
      animated: false
    });
  }
}
