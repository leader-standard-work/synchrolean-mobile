//  account.ts contains the account class

export class Account {
  ownerId: number;
  teamId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isDeleted: boolean;

  constructor() {}
}

// export interface AccountServerInterface {
//   ownerId: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   isDeleted: boolean;
// }

// export class Account {
//   private _ownerId: number;
//   private _firstname: string;
//   private _lastname: string;
//   private _email: string;
//   private _isDeleted: boolean;
//   private _serverUrl: string;

//   constructor(account: AccountServerInterface) {
//     this._ownerId = account.ownerId;
//     this._email = account.email;
//     this._firstname = account.firstName;
//     this._lastname = account.lastName;
//     this._isDeleted = account.isDeleted;
//   }

//   get ownerId(): number {
//     return this._ownerId;
//   }

//   //  Set/get for email
//   set email(newEmail: string) {
//     this._email = newEmail;
//   }

//   get email(): string {
//     return this._email;
//   }

//   //  Set/get for firstname
//   set firstname(newFirstname: string) {
//     this._firstname = newFirstname;
//   }

//   get firstname(): string {
//     return this._firstname;
//   }

//   //  Set/get for lastname
//   set lastname(newLastname: string) {
//     this._lastname = newLastname;
//   }

//   get lastname(): string {
//     return this._lastname;
//   }

//   set serverUrl(url: string) {
//     this._serverUrl = url;
//   }

//   get serverUrl(): string {
//     return this._serverUrl;
//   }
// }
