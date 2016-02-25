var upm_apa102 = require('jsupm_apa102');
var rgbb_1 = require("./rgbb");
var LEDStrip = (function () {
    function LEDStrip(nmbLeds, spiBus) {
        if (spiBus === void 0) { spiBus = 0; }
        this.nmbLeds = nmbLeds;
        this.spiBus = spiBus;
        this.driver = new upm_apa102.APA102(nmbLeds, spiBus, true);
        this.data = [];
        for (var i = 0; i < this.nmbLeds; i++) {
            this.data[i] = new rgbb_1.RGBB(0, 0, 0, 0);
        }
    }
    LEDStrip.prototype.setAllLeds = function (color) {
        for (var i = 0; i < this.nmbLeds; i++) {
            this.data[i].setRGBB(color);
        }
        this.driver.setAllLeds(color.BB, color.R, color.G, color.B);
        this.driver.pushState();
    };
    LEDStrip.prototype.turnOff = function () {
        this.setAllLeds(new rgbb_1.RGBB(0, 0, 0, 0));
    };
    LEDStrip.prototype.FadeOut = function (duration) {
    };
    return LEDStrip;
})();
exports.LEDStrip = LEDStrip;
//# sourceMappingURL=ledstrip.js.map