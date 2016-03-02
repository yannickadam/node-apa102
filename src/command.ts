/**
 * Command
 *
 */
export class Command {

  public method:string;
  public params:any[];

  /**
   *
   */
  constructor(method:string, params:any[]) {
    this.method = method;
    this.params = params;
  }
}