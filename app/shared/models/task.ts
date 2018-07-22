export enum Duration {
  Once = 'Once',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

function durationValue(duration: Duration): number {
  switch (duration) {
    case Duration.Once: {
      return 0;
    }
    case Duration.Daily: {
      return 1;
    }
    case Duration.Weekly: {
      return 2;
    }
    case Duration.Monthly: {
      return 3;
    }
    default: {
      return 0;
    }
  }
}

export class Task {
  private _databaseId: number;
  private _serverId: number;
  private _name: string;
  private _description: string;
  private _duration: Duration; //number
  private _complete: boolean;
  private _completedOn: Date; // Can be null
  private _expires: Date;
  private _created: Date;
  private _updated: Date; //This date will change whenever a task is updated
  private _deleted: Date; // Can be null

  constructor(
    name: string,
    description: string = '',
    duration: Duration = Duration.Once
  ) {
    this._databaseId = -1;
    this._serverId = -1;
    this._name = name;
    this._description = description;
    this._duration = duration;
    this._complete = false;
    this._completedOn = null;
    this._expires = new Date();
    this.setResetDate();
    this._created = new Date();
    this._updated = new Date();
    this._deleted = null;
  }

  public populateFromDB(
    databaseId: number,
    serverId: number,
    name: string,
    description: string,
    duration: string,
    complete: number,
    completedOn: string,
    expires: string,
    created: string,
    updated: string,
    deleted: string
  ) {
    this._databaseId = databaseId;
    this._serverId = serverId;
    this._name = name;
    this._description = description;
    switch (duration) {
      case 'Once': {
        this._duration = Duration.Once;
        break;
      }
      case 'Daily': {
        this._duration = Duration.Daily;
        break;
      }
      case 'Weekly': {
        this._duration = Duration.Weekly;
        break;
      }
      case 'Monthly': {
        this._duration = Duration.Monthly;
        break;
      }
      default: {
        this._duration = Duration.Once;
        break;
      }
    }
    this._complete = complete === 0 ? false : true;
    this._completedOn = completedOn === 'null' ? null : new Date(completedOn);
    this._expires = expires === 'null' ? null : new Date(expires);
    this._created = created === 'null' ? null : new Date(created);
    this._updated = updated === 'null' ? null : new Date(updated);
    this._deleted = deleted === 'null' ? null : new Date(deleted);
  }

  set serverId(id: number) {
    this._serverId = id;
  }

  get serverId(): number {
    return this._serverId;
  }

  set databaseId(id: number) {
    this._databaseId = id;
  }

  get databaseId(): number {
    return this._databaseId;
  }

  set name(value: string) {
    this._name = value;
    this._updated = new Date();
  }

  get name(): string {
    return this._name;
  }

  set description(value: string) {
    this._description = value;
    this._updated = new Date();
  }

  get description(): string {
    return this._description;
  }

  get expires(): Date {
    return this._expires;
  }

  get created(): Date {
    return this._created;
  }

  get updated(): Date {
    return this._updated;
  }

  get deleted(): Date {
    return this._deleted;
  }

  set duration(value: Duration) {
    this._duration = value;
    this._updated = new Date();
    this._expires = new Date();
    this.setResetDate();
  }

  get duration(): Duration {
    return this._duration;
  }

  set complete(value: boolean) {
    this._updated = new Date();
    this._completedOn = value === true ? new Date() : null;
    this._complete = value;
  }

  get complete(): boolean {
    return this._complete;
  }

  get completedOn(): Date {
    return this._completedOn;
  }

  public delete() {
    this._updated = new Date();
    this._deleted = new Date();
  }

  public toServerObject(userId: number): any {
    if (this._serverId == -1) {
      return {
        name: this._name,
        description: this._description,
        isRecurring: this._duration === Duration.Once ? false : true,
        creationDate: this._created,
        isComplete: this._complete,
        completionDate: this._completedOn,
        isRemoved: this._deleted === null ? false : true,
        ownerId: userId
      };
    }
    return {
      id: this._serverId,
      name: this._name,
      description: this._description,
      isRecurring: this._duration === Duration.Once ? false : true,
      creationDate: this._created,
      isComplete: this._complete,
      completionDate: this._completedOn,
      isRemoved: this._deleted === null ? false : true,
      ownerId: userId
    };
  }

  public setResetDate() {
    let today = new Date();

    if (this._expires > today) {
      return;
    }

    switch (this._duration) {
      case Duration.Once: {
        this._expires = new Date('December 1, 9999 00:00:00');
        break;
      }
      case Duration.Daily: {
        this._expires.setDate(today.getDate() + 1);
        break;
      }
      case Duration.Weekly: {
        this._expires.setDate(today.getDate() + (7 - today.getDay()));
        break;
      }
      case Duration.Monthly: {
        this._expires.setDate(1);
        this._expires.setMonth(today.getMonth() + 1);
        break;
      }
      default: {
        this._expires = new Date('December 1, 9999 00:00:00');
        break;
      }
    }
    this._updated = new Date();
  }
}

export function compareTask(a: Task, b: Task): number {
  if (a.complete && b.complete) {
    return 0;
  }
  if (a.complete && !b.complete) {
    return 1;
  }
  if (!a.complete && b.complete) {
    return -1;
  }
  return durationValue(a.duration) - durationValue(b.duration);
}
