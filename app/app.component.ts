import { Component, OnInit } from '@angular/core';
import { AccountService } from '~/shared/services/account.service';
var appSettings = require('application-settings');

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private accountService: AccountService) {}
}
