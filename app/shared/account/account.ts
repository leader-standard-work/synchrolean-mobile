//  account.ts contains the account class

export class Account{
  private email: string;
  private firstname: string;
  private lastname: string;
  private password: string; //TESTING ONLY

  constructor(
    email: string,
    firstname: string,
    lastname: string,
    password: string,  //TESTING ONLY
  ){
      this.email = email;
      this.firstname = firstname;
      this.lastname = lastname;
      this.password = password; //TESTING ONLY
    
  }

  //  Set/get for email
  public setEmail(email:string){
      this.email= email;
  }

  public getEmail(): string {
      return this.email;
  }

  //  Set/get for firstname
  public setFirstname(firstname:string){
      this.firstname = firstname;
  }

  public getFirstname(): string {
      return this.firstname;
  }

  //  Set/get for lastname
  public setLastname(lastname:string){
       this.lastname = lastname;
  }

  public getLastname(): string{
      return this.lastname;
  }
  
  //  Set/get for password FOR TESTING ONLY
  public setPassword(password:string){  //TESTING ONLY, DELETE SOON
      this.password = password;
  }
  public getPassword(): string{  //TESTING ONLY, DELETE SOON
      return this.password;
  }
  
}