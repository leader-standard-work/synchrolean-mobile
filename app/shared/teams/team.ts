//This file contains the team class which contains array of team IDs, team names, and team descriptions

export class team{
  private _Id: number = 0; //the unique ID for a team
  private _TeamName: string; //the name for a team
  private _TeamDescription: string; //the description for a team
  private _OwnerId: number; //Owner of the teams server ID

  constructor( //creating a team from passed in data
      Id: number,
      TeamName: string,
      TeamDescription: string,
      OwnerId: number
  ){
      //copy data from passed in args
      this.Id = Id;
      this.TeamName = TeamName;
      this.TeamDescription = TeamDescription;
      this.OwnerId = OwnerId;
  } //end of constructor

  //set and get functiosn for id, name, and description
  public set Id(id: number){
    this._Id = id;
  }

  public get Id(): number{
    return this._Id;
  }

  public set TeamName(name: string){
      this.TeamName = name;
  }

  public get TeamName(): string{
      return this.TeamName;
  }

  public set TeamDescription(description:string){
      this.TeamDescription = description;
  }

  public get TeamDescription(): string{
      return this.TeamDescription;
  }

  public set OwnerId(id:number){
        this.OwnerId = id;
  }

  public get OwnerId(): number{
      return this.OwnerId;
  }
  //end of Set/Get functions
}
