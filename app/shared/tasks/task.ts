export class Task {
  private static count: number = 0;

  private id: number;
  private description: string;
  private completed: boolean;
  private note: string;

  constructor(description: string, note: string = '') {
    this.id = Task.count;
    Task.count++;
    this.description = description;
    this.completed = false;
    this.note = note;
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
    nwcomplete: boolean
  ): void {
    this.id = nwid;
    this.description = nwdescription;
    this.completed = nwcomplete;
  }
}
