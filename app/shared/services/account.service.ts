import { Injectable } from '@angular/core';
import * as AppSettings from 'application-settings';

import { Account } from '~/shared/models/account';

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
    let email = AppSettings.getString('email', '');
    let firstname = AppSettings.getString('firstname', '');
    let lastname = AppSettings.getString('lastname', '');
    let ownerId = AppSettings.getNumber('ownerId', -1);
    let serverUrl = AppSettings.getString('serverUrl', '');
    let account

    if (
      email === '' ||
      firstname === '' ||
      lastname === '' ||
      ownerId === -1 ||
      serverUrl === ''
    ) {
      this._account = null;
      this._state = State.LoggedOut;
    } else {
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

  get serverUrl(): string {
    if (this._account === null) {
      return '';
    }
    return this._account.serverUrl;
  }

  logout() {
    this._account = null;
    this._state = State.LoggedOut;
    AppSettings.clear();
  }

  set account(account: Account) {
    this._account = account;
    this._state = State.LoggedIn;

    AppSettings.setString('email', account.email);
    AppSettings.setString('firstname', account.firstname);
    AppSettings.setString('lastname', account.lastname);
    AppSettings.setNumber('ownerId', account.ownerId);
    AppSettings.setString('serverUrl', account.serverUrl);
    //appSettings.setString("token", account.token);
  }

  get account(): Account {
    return this._account;
  }
}
