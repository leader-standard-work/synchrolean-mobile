import { Injectable } from '@angular/core';
import { Account } from '~/shared/models/account';
import { ServerService } from '~/shared/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _account: Account;

  constructor() {
    // if (serverService.isLoggedIn()) {
    //   //Get the account from the server
    // }
  }

  set account(account: Account) {
    this._account = account;
  }

  get account(): Account {
    return this._account;
  }
}
