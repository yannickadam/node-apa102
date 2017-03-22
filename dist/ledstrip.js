"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var upm_apa102 = require('jsupm_apa102');
var rgbab_1 = require("./rgbab");
var LEDStrip = (function () {
    function LEDStrip(nmbLeds, nmbLayers, spiBus) {
        if (nmbLayers === void 0) { nmbLayers = 1; }
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
        for (var i = 0; i < this.nmbLayers + 1; i++) {
            this.layers[i] = [];
            for (var j = 0; j < this.nmbLeds; j++) {
                this.layers[i][j] = new rgbab_1.RGBAB(0, 0, 0, 1, 31);
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
    LEDStrip.prototype.rainbow = function (offset) {
        if (offset === void 0) { offset = 0; }
        var itr = Math.floor((this.nmbLeds - offset) / 6);
        var rainbow_colors = [new rgbab_1.RGBAB(255, 0, 0, 1, 31),
            new rgbab_1.RGBAB(255, 127, 0, 1, 31),
            new rgbab_1.RGBAB(255, 255, 0, 1, 31),
            new rgbab_1.RGBAB(0, 255, 0, 1, 31),
            new rgbab_1.RGBAB(0, 0, 255, 1, 31),
            new rgbab_1.RGBAB(75, 0, 130, 1, 31)];
        for (var i_1 = 0; i_1 < offset; i_1++) {
            this.layers[1][i_1].setRGBAB(rgbab_1.RGBAB.fromHSL(0, 1.0, 0.5));
        }
        for (var i = offset; i < this.nmbLeds; i++) {
            var idx = Math.min(Math.floor(i / itr), 5);
            this.layers[1][i].setRGBAB(rainbow_colors[idx]);
        }
        this.commit();
    };
    LEDStrip.prototype.rainbow_smooth = function (offset) {
        if (offset === void 0) { offset = 0; }
        var itr = (280 / 360) / (this.nmbLeds - offset);
        for (var i = 0; i < offset; i++) {
            this.layers[1][i].setRGBAB(rgbab_1.RGBAB.fromHSL(0, 1.0, 0.5));
        }
        for (var i = offset; i < this.nmbLeds; i++) {
            var color = rgbab_1.RGBAB.fromHSL(i * itr, 1.0, 0.5);
            this.layers[1][i].setRGBAB(color);
        }
        this.commit();
    };
    LEDStrip.prototype.rs2 = function (offset) {
        if (offset === void 0) { offset = 0; }
        var itr = 1 / this.nmbLeds;
        for (var i = 0; i < offset; i++) {
            this.layers[1][i].setRGBAB(new rgbab_1.RGBAB(255, 0, 0, 1, 31));
        }
        for (var i = offset; i < this.nmbLeds; i++) {
            var div = (Math.abs((itr * i) % 1) * 6);
            var ascending = Math.floor((div % 1) * 255);
            var descending = 255 - ascending;
            var color = void 0;
            switch (Math.floor(div)) {
                case 0:
                    color = new rgbab_1.RGBAB(255, ascending, 0, 1, 31);
                    break;
                case 1:
                    color = new rgbab_1.RGBAB(descending, 255, 0, 1, 31);
                    break;
                case 2:
                    color = new rgbab_1.RGBAB(0, 255, ascending, 1, 31);
                    break;
                case 3:
                    color = new rgbab_1.RGBAB(0, descending, 255, 1, 31);
                    break;
                case 4:
                    color = new rgbab_1.RGBAB(ascending, 0, 255, 1, 31);
                    break;
                default:
                    color = new rgbab_1.RGBAB(255, 0, descending, 1, 31);
            }
            this.layers[1][i] = color;
        }
        this.commit();
    };
    LEDStrip.prototype.rs3 = function (offset) {
        if (offset === void 0) { offset = 0; }
        var itr = Math.floor((this.nmbLeds - offset) / 7);
        var hues = [2, 24, 39, 70, 158, 230, 252];
        for (var i_2 = 0; i_2 < offset; i_2++) {
            this.layers[1][i_2].setRGBAB(rgbab_1.RGBAB.fromHSL(2 / 360, 1.0, 0.5));
        }
        for (var i = 0; i < (this.nmbLeds - offset); i++) {
            var idx = Math.min(Math.floor(i / itr), 5);
            var hue = hues[idx] + ((hues[idx + 1] - hues[idx]) * (((i - (idx * itr)) / itr) % itr));
            this.layers[1][i + offset] = rgbab_1.RGBAB.fromHSL(hue / 360, 1.0, 0.5);
        }
        this.commit();
    };
    LEDStrip.prototype.turnOff = function () {
        for (var i = 0; i < this.nmbLayers; i++) {
            this.setAllLeds(new rgbab_1.RGBAB(0, 0, 0, 1, 31), i);
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
    LEDStrip.prototype.fadeToRainbow = function (type, offset, duration, layer) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        if (duration === void 0) { duration = 200; }
        if (layer === void 0) { layer = 0; }
        var counter = 255;
        if (type == 4) {
            this.rs3(offset);
        }
        else if (type == 3) {
            this.rs2(offset);
        }
        else if (type == 2) {
            this.rainbow_smooth(offset);
        }
        else {
            this.rainbow(offset);
        }
        var twit = setInterval(function () {
            for (var i = 0; i < _this.nmbLeds; i++) {
                var current = _this.layers[layer][i];
                var color = _this.layers[1][i];
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
}());
exports.LEDStrip = LEDStrip;
//# sourceMappingURL=ledstrip.js.map