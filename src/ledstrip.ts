///<reference path="../typings/main.d.ts" />

// Because jsupm_apa102 is generally installed as a compiled, global node module. Prevents TypeScript errors on compile.
var upm_apa102 = require('jsupm_apa102');
import {RGBAB} from "./rgbab";

/**
 * LEDStrip
 */
export class LEDStrip {

  private driver:any;
  private data:Buffer;      // This is used for output and communication with the driver.

  public layers:RGBAB[][];   // This contains color data
  public queue:any[];

  /**
   * Instantiate a new APA102 LED Strip using jsupm_apa102 driver
   *
   */
  constructor(private nmbLeds:number, private nmbLayers:number = 1, spiBus:number = 0) {
    this.driver = new upm_apa102.APA102(this.nmbLeds, spiBus, false);

    // Init Buffer
    this.data = new Buffer(this.nmbLeds*4);
    this.data.fill(0);

    // Sets the LEDs to "off"
    for( var i=0; i < this.nmbLeds; i+=4) {
      this.data[i] = 224;
    }

    // Init Layers
    this.layers = [];
    for( var i=0; i < this.nmbLayers; i++) {
      this.layers[i] = [];
      for( var j=0; j < this.nmbLeds; j++) {
        this.layers[i][j] = new RGBAB(0,0,0,1,31);
      }
    }

  }

  /**
   * setAllLeds to a determined color on a specific layer
   *
   * @param color
   * @param layer
   */
  public setAllLeds( color:RGBAB, layer:number=0 ) {
    for( var i=0; i < this.nmbLeds; i++) {
      this.layers[layer][i].setRGBAB(color);
    }
    this.commit();
  }

  public rainbow( layer:number=0 ) {
 
    var itr = Math.floor( this.nmbLeds / 7 );

    var rainbow_colors = [ new RGBAB(255, 0, 0, 1, 31),
			   new RGBAB(255, 127, 0, 1, 31),
			   new RGBAB(255, 255, 0, 1, 31),
			   new RGBAB(0, 255, 0, 1, 31),
			   new RGBAB(0, 0, 255, 1, 31), 
			   new RGBAB(75, 0, 130, 1, 31), 
			   new RGBAB(143, 0, 255, 1, 31) ];

    for( var i=0; i < this.nmbLeds; i++ ) {
	var idx = Math.min(Math.floor(i / itr), 6);
	this.layers[layer][i].setRGBAB(rainbow_colors[idx]);
    }
    
    this.commit();

  }


  /**
   * turnOff()
   * Shuts down all LEDs on all layers
   */
  public turnOff() {
    for( var i=0; i < this.nmbLayers; i++) {
      this.setAllLeds( new RGBAB(0,0,0,1,31), i );
    }
    this.commit();
  }

  /**
   * commit
   * Renders all layers into the buffer, and send it to the driver
   */
  public commit() {
    for( var led=0; led < this.nmbLeds; led++) {

      var color = new RGBAB(0, 0, 0, 1, 31);
      for (var layer = 0; layer < this.nmbLayers; layer++) {
        color.add(this.layers[layer][led]);
      }
      this.data[led*4] = color.BB | 224;
      this.data[led*4+1] = color.B;
      this.data[led*4+2] = color.G;
      this.data[led*4+3] = color.R;
    }
    this.driver.setLeds(0, this.nmbLeds-1, this.data);
  }

  /**
   * FadeOut
   * Will
   *
   * @param duration
   * @param layer
   */
  public fadeOut(duration:number, layer:number=0) {
    var counter = 255;

    var time = Date.now();

    var twit = setInterval( ()=> {
      for( var i=0; i < this.nmbLeds; i++) {
        var color = this.layers[layer][i];
        if( color.R > 0 ) color.R--;
        if( color.G > 0 ) color.G--;
        if( color.B > 0 ) color.B--;
      }
      counter--;
      this.commit();
      if( counter == 0) {
        clearInterval(twit);
        console.log("Runtime:", Date.now()-time);
      }
    }, 0);

    // Either compute the time according to steps
    // Or compute the steps according to elapsed time
  }

  /**
   *
   * @param color
   * @param duration
   * @param layer
   */
  public fadeTo(color:RGBAB, duration:number, layer:number=0) {

    var counter = 255;

    var twit = setInterval( () => {
      for (var i = 0; i < this.nmbLeds; i++) {
        var current = this.layers[layer][i];
        if( current.R > color.R ) current.R--;
        else if( current.R < color.R ) current.R++;
        if( current.G > color.G ) current.G--;
        else if( current.G < color.G ) current.G++;
        if( current.B > color.B ) current.B--;
        else if( current.B < color.B ) current.B++;
      }

      counter--;
      this.commit();
      if( counter == 0) {
        clearInterval(twit);
      }

    }, 0);

  }

}
