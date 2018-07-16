//This file contains the team class which contains array of team IDs, team names, and team descriptions

export class team{
  private id: number = 0; //the unique ID for a team
  private name: string; //the name for a team
  private description: string; //the description for a team

  constructor( //creating a team from passed in data
      id: number,
      name: string,
      description: string
  ){
      //copy data from passed in args
      this.id = id;
      this.name = name;
      this.description = description;
  } //end of constructor

  //set and get functiosn for id, name, and description
  public setId(id: number){
    this.id = id;
  }

  public getId(): number{
    return this.id;
  }

  public setName(name: string){
      this.name = name;
  }

  public getName(): string{
      return this.name;
  }

  public setDescription(description:string){
      this.description = description;
  }

  public getDescription(): string{
      return this.description;
  }
  //end of Set/Get functions
}
