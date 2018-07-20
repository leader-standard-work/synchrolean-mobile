//This file contains the team class which contains array of team IDs, team names, and team descriptions

export class Team {
  private _Id: number = 0; //the unique ID for a team
  private _TeamName: string; //the name for a team
  private _TeamDescription: string; //the description for a team
  private _OwnerId: number;

  constructor( //creating a team from passed in data
      Id: number,
      TeamName: string,
      TeamDescription: string,
      OwnerId: number
  ){
      //copy data from passed in args
      this._Id = Id;
      this._TeamName = TeamName;
      this._TeamDescription = TeamDescription;
      this._OwnerId = OwnerId;
  } //end of constructor

  //set and get functiosn for id, name, and description
  public set Id(id: number){
    this.Id = id;
  }

  public get Id(): number{
    return this.Id;
  }

  public set TeamName(name: string){
      this.TeamName = name;
  }

  public getTeamName(): string{
      return this.TeamName;
  }

  public set TeamDescription(description:string){
      this._TeamDescription = description;
  }

  public get TeamDescription(): string{
      return this._TeamDescription;
  }

  public set OwnerId(id:number){
        this._OwnerId = id;
  }

  public get OwnerId(): number{
      return this._OwnerId;
  }
  //end of Set/Get functions
}
