var upm_apa102 = require('jsupm_apa102');
var LEDStrip = (function () {
    function LEDStrip(nmbLeds, spiBus) {
        if (spiBus === void 0) { spiBus = 0; }
        this.nmbLeds = nmbLeds;
        this.spiBus = spiBus;
        this.driver = new upm_apa102.APA102(nmbLeds, spiBus, true);
        this.driver.setAllLeds(31, 255, 0, 255);
        this.driver.pushState();
    }
    return LEDStrip;
})();
exports.LEDStrip = LEDStrip;
//# sourceMappingURL=ledstrip.js.map