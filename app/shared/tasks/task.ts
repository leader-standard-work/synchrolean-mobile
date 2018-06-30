export class Task {
  private static count: number = 0;

  private id: number;
  private description: string;
  private completed: boolean;

  constructor(description: string) {
    this.id = Task.count;
    Task.count++;
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
}
