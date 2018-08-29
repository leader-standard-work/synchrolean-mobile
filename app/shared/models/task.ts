// export enum Duration {
//   Once = 'Once',
//   Daily = 'Daily',
//   Weekly = 'Weekly',
//   Monthly = 'Monthly'
// }

export enum Frequency {
  Once,
  Daily,
  Weekly,
  Monthly
}

export class Task {
  databaseId: number;
  id: number;
  name: string;
  description: string;
  isRecurring: boolean;
  weekdays: number;
  creationDate: Date;
  isCompleted: boolean;
  completionDate: Date;
  isDeleted: boolean;
  ownerEmail: string;
  frequency: Frequency;
  teamId: number;
  dirty: boolean;
  expires: Date;

  constructor(task: Task = null) {
    if (task === null) {
      this.databaseId = -1;
      this.id = -1;
      this.name = '';
      this.description = '';
      this.isRecurring = true;
      this.weekdays = 0;
      this.creationDate = new Date();
      this.isCompleted = false;
      this.completionDate = null;
      this.isDeleted = false;
      this.ownerEmail = '';
      this.frequency = Frequency.Once;
      this.teamId = -1;
    } else {
      this.databaseId = task.databaseId === null ? -1 : task.databaseId;
      this.id = task.id === null ? -1 : task.id;
      this.name = task.name;
      this.description = task.description;
      this.isRecurring = true;
      this.weekdays = task.weekdays;
      this.creationDate = task.creationDate;
      this.isCompleted = task.isCompleted;
      this.completionDate = task.completionDate;
      this.isDeleted = task.isDeleted;
      this.ownerEmail = task.ownerEmail;
      this.frequency = task.frequency;
      this.teamId = task.teamId;
    }
    this.dirty = false;
    this.expires = new Date();
    this.setResetDate();
  }

  compare(task: Task) {
    if (
      this.name === task.name &&
      this.description === task.description &&
      this.weekdays === task.weekdays &&
      this.isCompleted === task.isCompleted &&
      this.isDeleted === task.isDeleted &&
      this.frequency === task.frequency &&
      this.teamId === task.teamId
    ) {
      return true;
    }
    return false;
  }

  getFrequency(): string {
    switch (this.frequency) {
      case Frequency.Once: {
        return 'Once';
      }
      case Frequency.Daily: {
        return 'Daily';
      }
      case Frequency.Weekly: {
        return 'Weekly';
      }
      case Frequency.Monthly: {
        return 'Monthly';
      }
    }
  }

  setResetDate() {
    const today = new Date();

    if (today < this.expires) {
      return;
    }

    this.expires.setHours(0, 0, 0, 0);
    switch (this.frequency) {
      case Frequency.Once: {
        this.expires = new Date('December 1, 9999 00:00:00');
        break;
      }
      case Frequency.Daily: {
        if (this.weekdays === 0) {
          this.expires.setDate(today.getDate() + 1);
        }
        for (let i = today.getDay(); i < 7; i++) {
          let day = 1 << i;
          if (day & this.weekdays) {
            this.expires.setDate(today.getDate() + (i - today.getDay()) + 1);
            break;
          }
        }
        if (today > this.expires) {
          for (let i = 0; i < today.getDay(); i++) {
            let day = 1 << i;
            if (day & this.weekdays) {
              this.expires.setDate(
                today.getDate() + (i + 7 - today.getDay()) + 1
              );
              break;
            }
          }
        }
        break;
      }
      case Frequency.Weekly: {
        this.expires.setDate(today.getDate() + (7 - today.getDay()));
        break;
      }
      case Frequency.Monthly: {
        this.expires.setDate(1);
        this.expires.setMonth(today.getMonth() + 1);
        break;
      }
      default: {
        this.expires = new Date('December 1, 9999 00:00:00');
        break;
      }
    }
  }

  delete() {
    this.isDeleted = true;
  }
}

export function compareTask(a: Task, b: Task): number {
  if (a.isCompleted && !b.isCompleted) {
    return 1;
  }
  if (!a.isCompleted && b.isCompleted) {
    return -1;
  }
  return a.frequency - b.frequency;
}
