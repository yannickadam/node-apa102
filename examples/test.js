var LEDStrip = require("../index.js").LEDStrip;
var RGBAB = require("../index.js").RGBAB;


var ledStrip = new LEDStrip(60);
//ledStrip.setAllLeds( RGBAB.fromColorName("red") );
ledStrip.driver.setAllLeds(31, 255, 0, 0);
