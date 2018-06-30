export class Task {
  private static count: number = 0;

  private id: number;
  private info: string;
  private completed: boolean;

  constructor(info: string) {
    this.id = Task.count;
    Task.count++;
    this.info = info;
    this.completed = false;
  }
}
