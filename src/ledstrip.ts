declare function require(name: string): any;
var upm_apa102 = require('jsupm_apa102');
import {RGBB} from "./rgbb";

export class LEDStrip {

  private driver:any;
  public data:RGBB[];

  /**
   * Instantiate a new APA102 LED Strip using jsupm_apa102 driver
   *
   */
  constructor(private nmbLeds:Number, private spiBus:Number = 0) {
    this.driver = new upm_apa102.APA102(nmbLeds, spiBus, true);

    for( var i=0; i < this.nmbLeds; i++) {
      this.data[i] = new RGBB(0,0,0,0);
    }
  }

  /**
   *
   * @param color
   */
  public setAllLeds( color:RGBB ) {
    for( var i=0; i < this.nmbLeds; i++) {
      this.data[i].setRGBB(color);
    }
    // Special case, no need to copy leds one by one
    this.driver.setAllLeds(color.BB, color.R, color.G, color.B);
    this.driver.pushState();
  }

  /**
   * turnOff()
   * Shuts down all leds
   */
  public turnOff( ) {
    this.setAllLeds( new RGBB(0,0,0,0) );
  }

  /**
   * FadeOut
   * Will
   *
   * @param duration
   */
  public FadeOut(duration:number) {

    // Either compute the time according to steps
    // Or compute the steps according to elapsed time

  }

}