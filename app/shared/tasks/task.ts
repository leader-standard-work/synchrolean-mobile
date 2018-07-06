export enum Duration {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

export class Task {
  private static count: number = 0;

  private id: number;
  private description: string;
  private completed: boolean;
  private note: string;
  private duration: Duration;

  constructor(
    description: string,
    duration: Duration = Duration.Once,
    note: string = ''
  ) {
    this.id = Task.count;
    Task.count++;
    this.description = description;
    this.completed = false;
    this.note = note;
    this.duration = duration;
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

  public complete() {
    this.completed = this.completed ? false : true;
  }

  public isComplete(): boolean {
    return this.completed;
  }

  public populate(
    nwid: number,
    nwdescription: string,
    nwcomplete: boolean,
    nwNote: string,
    nwDur: Duration
  ): void {
    this.id = nwid;
    this.description = nwdescription;
    this.completed = nwcomplete;
    this.note = nwNote;
    this.duration = nwDur;
  }
}
