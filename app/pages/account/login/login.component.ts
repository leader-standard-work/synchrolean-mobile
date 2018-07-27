//The login form component is used to create a NEW account
//aka. User data did not previously exist on the server
import { Component, OnInit } from '@angular/core';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '~/shared/models/account';
import { ServerService } from '~/shared/services/server.service';

@Component({
  selector: 'login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public accountFormGroup: FormGroup;

  constructor(
    private serverService: ServerService,
    private formBuilder: FormBuilder,
    private pageRoute: PageRoute,
    private routerExtensions: RouterExtensions
  ) {
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
      email: [
        email,
        Validators.compose([Validators.required, Validators.email])
      ],
      password: [password, Validators.required]
    });
  }

  loginTapped() {
    let serverUrl = this.accountFormGroup.value.serverUrl;
    let email = this.accountFormGroup.value.email;
    let password = this.accountFormGroup.value.password;

    this.serverService.login(serverUrl, email, password);
  }
}
