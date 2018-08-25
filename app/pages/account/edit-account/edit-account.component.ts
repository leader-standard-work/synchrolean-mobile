import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular/router';
import * as AppSettings from 'tns-core-modules/application-settings/application-settings';

import { ServerService } from '~/shared/services/server.service';
import { AccountService } from '~/shared/services/account.service';
import { Account } from '~/shared/models/account';

@Component({
  selector: 'edit-account',
  moduleId: module.id,
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  public accountFormGroup: FormGroup;
  public tempUrl: string = 'http://10.0.2.2:55542';

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    this.accountFormGroup = this.formBuilder.group({
      serverUrl: [this.tempUrl, Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  editAccountTapped() {
    let account = new Account();
    const url = this.accountFormGroup.value.serverUrl;
    account.email = AppSettings.getString('email', '');
    account.firstName = this.accountFormGroup.value.firstname;
    account.lastName = this.accountFormGroup.value.lastname;
    account.password = this.accountFormGroup.value.password;


    let options = {
      title: 'Could not connect to server',
      okButtonText: 'Ok'
    };

    this.accountService.edit(url, account).subscribe(
      response => {
        console.log(response);
        this.routerExtensions.navigate(['/account'], {
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

  backToAccount(){
    this.routerExtensions.navigate(['/account'], {
      transition: {
        name: 'slideRight'
      },
      clearHistory: true
    });
  }
}
