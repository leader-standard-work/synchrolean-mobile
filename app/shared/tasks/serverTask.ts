import { Task, Duration } from './task';

export class ServerTask {
  private _id: number;
  private _name: string;
  private _description: string;
  private _isRecurring: boolean;
  private _weekdays: number;
  private _creationDate: Date;
  private _isComplete: boolean;
  private _completionDate: Date;
  private _isRemoved: boolean;
  private _ownerId: number;

  constructor(task: Task, ownerId: number) {
    this._id = task.getServerId();
    this._name = task.getDescription();
    this._description = task.getNote();
    this._isRecurring = task.getDuration() === Duration.Once ? false : true;
    switch (task.getDuration()) {
      case Duration.Once: {
        this._weekdays = 0;
        break;
      }
      case Duration.Daily: {
        this._weekdays = 1;
        break;
      }
      case Duration.Weekly: {
        this._weekdays = 2;
        break;
      }
      case Duration.Monthly: {
        this._weekdays = 3;
        break;
      }
      default: {
        this._weekdays = 0;
        break;
      }
    }
    this._creationDate = task.getDate();
    this._isComplete = task.isComplete();
    this._completionDate = task.getResetDate();
    this._isRemoved = false;
    this._ownerId = ownerId;
  }

  public toJson() {
    if (this._id === -1) {
      return {
        name: this._name,
        description: this._description,
        isRecurring: this._isRecurring,
        weekdays: this._weekdays,
        creationDate: this._creationDate,
        isComplete: this._isComplete,
        completionDate: this._completionDate,
        isRemoved: this._isRemoved,
        ownerId: this._ownerId
      };
    }
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      isRecurring: this._isRecurring,
      weekdays: this._weekdays,
      creationDate: this._creationDate,
      isComplete: this._isComplete,
      completionDate: this._completionDate,
      isRemoved: this._isRemoved,
      ownerId: this._ownerId
    };
  }

  public toTask(): Task {
    let task = new Task('');
    task.setId(this._id);
    task.setServerId(this._ownerId);
    task.setDescription(this._name);
    task.setNote(this._description);
    task.setComplete(this._isComplete);
    task.setDate(this._creationDate);
    switch (this._weekdays) {
      case 0: {
        task.setDuration(Duration.Once);
        break;
      }
      case 1: {
        task.setDuration(Duration.Daily);
        break;
      }
      case 2: {
        task.setDuration(Duration.Weekly);
        break;
      }
      case 3: {
        task.setDuration(Duration.Monthly);
        break;
      }
      default: {
        task.setDuration(Duration.Once);
        break;
      }
    }
    return task;
  }
}
