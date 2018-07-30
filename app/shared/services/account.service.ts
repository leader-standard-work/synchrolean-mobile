import { Injectable } from '@angular/core';

import { Account } from '~/shared/models/account';
import { ServerService } from '~/shared/services/server.service';
var appSettings = require('application-settings');

export enum State {
  LoggedIn,
  LoggedOut
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _account: Account;
  private _state: State = State.LoggedOut;

  constructor() {
    if (
      appSettings.hasKey('email') &&
      appSettings.hasKey('firstname') &&
      appSettings.hasKey('lastname') &&
      appSettings.hasKey('ownerId') &&
      appSettings.hasKey('serverUrl')
    ) {
      let email = appSettings.getString('email');
      let firstname = appSettings.getsetString('firstname');
      let lastname = appSettings.getsetString('lastname');
      let ownerId = appSettings.getsetNumber('ownerId');
      let serverUrl = appSettings.getsetString('serverUrl');

      let account = new Account({
        ownerId: ownerId,
        firstName: firstname,
        lastName: lastname,
        email: email,
        isDeleted: false
      });
      this._account = account;
      this._account.serverUrl = serverUrl;
      this._state = State.LoggedIn;
    }
  }

  get state(): State {
    return this._state;
  }

  // set state(state: State) {
  //   this._state = state;
  // }

  get serverUrl(): string {
    if (this._account === null) {
      return '';
    }
    return this._account.serverUrl;
  }

  logout() {
    this._account = null;
    this._state = State.LoggedOut;
    appSettings.clear();
  }

  set account(account: Account) {
    this._account = account;
    this._state = State.LoggedIn;

    appSettings.setString('email', account.email);
    appSettings.setString('firstname', account.firstname);
    appSettings.setString('lastname', account.lastname);
    appSettings.setNumber('ownerId', account.ownerId);
    appSettings.setString('serverUrl', account.serverUrl);
    //appSettings.setString("token", account.token);
  }

  get account(): Account {
    return this._account;
  }

  // public getAccountByEmail(email:string){
  //   return this.serverService.getAccountByEmail(email);
  // }
}
