import {Command} from "./command";
import {LEDStrip} from "./ledstrip";

/**
 *
 */
export class Scheduler {

  private queue:{command:Command, time:number}[] = [];
  private strip:LEDStrip;
  private currentIndex:number = 0;
  private timer:number;
  private loop:boolean;

  public playing = false;

  /**
   * constructor
   *
   * @param strip
   */
  constructor(strip:LEDStrip) {
    this.strip = strip;
  }

  /**
   *
   */
  public play(loop:boolean = false) {

    if( this.queue.length > 0) {
      var nextAction = this.queue[this.currentIndex];

      this.loop = loop;
      this.playing = true;
      this.timer = setTimeout( this._play_internal.bind(this), nextAction.time );
    } else {
      console.warn("Nothing to play in queue.");
    }
  }

  private _play_internal() {

    // Play the action
    var action = this.queue[this.currentIndex];
    var method:any = (<any>this.strip)[action.command.method];
    method.apply(this.strip, action.command.params);

    //(<any>this.strip)[action.command.method].apply(this.strip, action.command.params);

    console.log("Playing action:",action.command.method, "with params", action.command.params);
    // Note: We assume that the action returns almost instantly, so we do not need to account for the time spent. Just
    // setTimeout until the next action.
    // We may have some side effects if we run another action on the same layer while the first one isn't finished.
    // TODO: Investigate having a callback on the action instead?

    this.currentIndex++;

    // If we need to loop, do it here.
    if( this.currentIndex == this.queue.length && this.loop ) {
      this.currentIndex = 0;
    }

    if( this.currentIndex < this.queue.length ) {
      var nextAction = this.queue[this.currentIndex];
      this.timer = setTimeout( this._play_internal.bind(this), nextAction.time );
    } else {
      this.currentIndex = 0;
      this.playing = false;
    }
  }

  /**
   * pause
   *
   * Puts the sequence on hold. Play resumes it.
   */
  public pause() {
    if( this.timer )
      clearTimeout(this.timer);
  }

  /**
   * stop
   *
   * Stops playing, and resets the sequence
   */
  public stop() {
    this.pause();
    this.currentIndex = 0;
  }

  public add(command:Command, time:number) {

    var element = {command:command, time:time};

    // Insert at the proper spot in queue.
    for( var i=0; i < this.queue.length; i++) {
      var qc = this.queue[i];
      if( time < qc.time ) {
        this.queue.splice(i, 0, element);
        return;
      }
    }

    // If we reached here, we need to append to the end of the queue.
    this.queue.push(element);
  }
}
