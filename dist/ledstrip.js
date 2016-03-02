var upm_apa102 = require('jsupm_apa102');
var rgbab_1 = require("./rgbab");
var LEDStrip = (function () {
    function LEDStrip(nmbLeds, nmbLayers, spiBus) {
        if (spiBus === void 0) { spiBus = 0; }
        this.nmbLeds = nmbLeds;
        this.nmbLayers = nmbLayers;
        this.driver = new upm_apa102.APA102(this.nmbLeds, spiBus, false);
        this.data = new Buffer(this.nmbLeds * 4);
        this.data.fill(0);
        for (var i = 0; i < this.nmbLeds; i += 4) {
            this.data[i] = 224;
        }
        this.layers = [];
        for (var i = 0; i < this.nmbLayers; i++) {
            this.layers[i] = [];
            for (var j = 0; j < this.nmbLeds; j++) {
                this.layers[i][j] = new rgbab_1.RGBAB(0, 0, 0, 1, 0);
            }
        }
    }
    LEDStrip.prototype.setAllLeds = function (color, layer) {
        if (layer === void 0) { layer = 0; }
        for (var i = 0; i < this.nmbLeds; i++) {
            this.layers[layer][i].setRGBAB(color);
        }
        this.commit();
    };
    LEDStrip.prototype.turnOff = function () {
        for (var i = 0; i < this.nmbLayers; i++) {
            this.setAllLeds(new rgbab_1.RGBAB(0, 0, 0, 1, 0), i);
        }
        this.commit();
    };
    LEDStrip.prototype.commit = function () {
        for (var led = 0; led < this.nmbLeds; led++) {
            var color = new rgbab_1.RGBAB(0, 0, 0, 1, 31);
            for (var layer = 0; layer < this.nmbLayers; layer++) {
                color.add(this.layers[layer][led]);
            }
            this.data[led * 4] = color.BB | 224;
            this.data[led * 4 + 1] = color.B;
            this.data[led * 4 + 2] = color.G;
            this.data[led * 4 + 3] = color.R;
        }
        this.driver.setLeds(0, this.nmbLeds - 1, this.data);
    };
    LEDStrip.prototype.fadeOut = function (duration, layer) {
        var _this = this;
        if (layer === void 0) { layer = 0; }
        var counter = 255;
        var time = Date.now();
        var twit = setInterval(function () {
            for (var i = 0; i < _this.nmbLeds; i++) {
                var color = _this.layers[layer][i];
                if (color.R > 0)
                    color.R--;
                if (color.G > 0)
                    color.G--;
                if (color.B > 0)
                    color.B--;
            }
            counter--;
            _this.commit();
            if (counter == 0) {
                clearInterval(twit);
                console.log("Runtime:", Date.now() - time);
            }
        }, 0);
    };
    LEDStrip.prototype.fadeTo = function (color, duration, layer) {
        var _this = this;
        if (layer === void 0) { layer = 0; }
        var counter = 255;
        var twit = setInterval(function () {
            for (var i = 0; i < _this.nmbLeds; i++) {
                var current = _this.layers[layer][i];
                if (current.R > color.R)
                    current.R--;
                else if (current.R < color.R)
                    current.R++;
                if (current.G > color.G)
                    current.G--;
                else if (current.G < color.G)
                    current.G++;
                if (current.B > color.B)
                    current.B--;
                else if (current.B < color.B)
                    current.B++;
            }
            counter--;
            _this.commit();
            if (counter == 0) {
                clearInterval(twit);
            }
        }, 0);
    };
    return LEDStrip;
})();
exports.LEDStrip = LEDStrip;
//# sourceMappingURL=ledstrip.js.map