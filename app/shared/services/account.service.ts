import { Injectable } from '@angular/core';

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

  constructor() {}

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
  }

  set account(account: Account) {
    this._account = account;
    this._state = State.LoggedIn;
  }

  get account(): Account {
    return this._account;
  }
}
