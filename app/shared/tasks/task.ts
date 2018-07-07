export enum Duration {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}


export class Task {
  private id: number = -1;
  private description: string;
  private completed: boolean;
  private note: string;
  private duration: Duration;
  private date: Date;

  constructor(
    description: string,
    duration: Duration = Duration.Once,
    note: string = ''
  ) {
    this.description = description;
    this.completed = false;
    this.note = note;
    this.duration = duration;
    this.date = new Date();
  }

  public setId(id: number) {
    this.id = id;
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

  public setDuration(duration: Duration) {
    this.duration = duration;
  }

  public getDuration(): Duration {
    return this.duration;
  }

  public setNote(note: string) {
    this.note = note;
  }

  public getNote(): string {
    return this.note;
  }

  public setComplete(complete: boolean) {
    this.completed = complete;
  }

  public isComplete(): boolean {
    return this.completed;
  }

  public setDate(nwDate: Date){

  }

  public setDateStr(nwDate: string){
     this.date = new Date(nwDate);
  }

  public getDateStr(): string{
    return this.date.toString();
  }

  public getDate(): Date{
    return this.date;
  }

  public populate(
    nwid: number,
    nwdescription: string,
    nwcomplete: boolean,
    nwNote: string,
    nwDur: Duration,
    nwDate: Date): void {
    this.id = nwid;
    this.description = nwdescription;
    this.completed = nwcomplete;
    this.note = nwNote;
    this.duration = nwDur;
    this.date = new Date(nwDate);
  }
}
