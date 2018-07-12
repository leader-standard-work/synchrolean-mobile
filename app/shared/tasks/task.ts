export enum Duration {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

// Compare tasks by duration
export function taskCompareDuration(item1: Task, item2: Task): number {
  let duration1: Duration = item1.getDuration();
  let duration2: Duration = item2.getDuration();
  let value1: number;
  let value2: number;

  switch (duration1) {
    case Duration.Once: {
      value1 = 0;
      break;
    }
    case Duration.Daily: {
      value1 = 1;
      break;
    }
    case Duration.Weekly: {
      value1 = 2;
      break;
    }
    case Duration.Monthly: {
      value1 = 3;
      break;
    }
    default:
      value1 = 0;
      break;
  }
  switch (duration2) {
    case Duration.Once: {
      value2 = 0;
      break;
    }
    case Duration.Daily: {
      value2 = 1;
      break;
    }
    case Duration.Weekly: {
      value2 = 2;
      break;
    }
    case Duration.Monthly: {
      value2 = 3;
      break;
    }
    default: {
      value2 = 0;
      break;
    }
  }
  return value1 - value2;
}

export class Task {
  private id: number = -1;
  private description: string;
  private completed: boolean;
  private note: string;
  private duration: Duration;
  private date: Date;
  private resetDate: Date;

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
    this.resetDate = new Date();
    this.setResetDate();
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

  public setDate(nwDate: Date) {}

  public setDateStr(nwDate: string) {
    this.date = new Date(nwDate);
  }

  public getDateStr(): string {
    return this.date.toString();
  }

  public getDate(): Date {
    return this.date;
  }

  public populate(
    nwid: number,
    nwdescription: string,
    nwcomplete: boolean,
    nwNote: string,
    nwDur: Duration,
    nwDate: Date
  ): void {
    this.id = nwid;
    this.description = nwdescription;
    this.completed = nwcomplete;
    this.note = nwNote;
    this.duration = nwDur;
    this.date = new Date(nwDate);
  }

  public setResetDate() {
    let today = new Date();

    if (this.resetDate && this.resetDate > today) {
      return;
    }
    // don't set the reset date if its a one time task.
    if (this.duration === Duration.Once) {
      this.resetDate = null;
    }
    if (this.duration === Duration.Daily) {
      this.resetDate.setDate(today.getDate() + 1);
    }
    if (this.duration === Duration.Weekly) {
      this.resetDate.setDate(today.getDate() + (7 - today.getDay()));
    }
    // if the reset date is past but the same month as today then reset to next month.
    // otherwise if the reset date is a month/s behind then update to todays month.
    if (this.duration === Duration.Monthly) {
      this.resetDate.setDate(1);
      if (this.resetDate.getMonth() === today.getMonth()) {
        this.resetDate.setMonth(today.getMonth() + 1);
      }
      this.resetDate.setMonth(today.getMonth());
    }
  }
}
