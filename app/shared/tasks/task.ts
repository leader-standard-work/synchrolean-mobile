export class Task {

  private id: number;
  private description: string;
  private completed: boolean;

  constructor(description: string) {
    this.description = description;
    this.completed = false;
  }

  public getId(): number {
    return this.id;
  }
  public setDescription(description: string) {
    this.description = description;
  }
  public getDescription(): string {
    return this.description;
  }

  public complete() {
      this.completed = this.completed ? false : true;}
      
  public isComplete(): boolean {
    return this.completed;
  }

  public populate(nwid: number, nwdescription: string, nwcomplete: boolean) : void{
    this.id = nwid;
    this.description = nwdescription;
    this.completed= nwcomplete;
  }
}
