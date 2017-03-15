"use strict";
var RGBAB = (function () {
    function RGBAB(R, G, B, A, BB) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
        this.BB = BB;
    }
    RGBAB.prototype.setRGBAB = function (color) {
        this.R = color.R;
        this.G = color.G;
        this.B = color.B;
        this.A = color.A;
        this.BB = color.BB;
    };
    RGBAB.prototype.add = function (color) {
        var invA = 1 - color.A;
        this.R = (this.R * invA + color.R * color.A);
        this.G = (this.G * invA + color.G * color.A);
        this.B = (this.B * invA + color.B * color.A);
        this.BB = Math.min(this.BB + color.BB, 31);
    };
    RGBAB.fromColorName = function (name, alpha, brightness) {
        if (alpha === void 0) { alpha = 1; }
        if (brightness === void 0) { brightness = 31; }
        var color = RGBAB.Colors[name.toLowerCase()];
        if (color) {
            return new RGBAB(color.R, color.G, color.B, alpha, brightness);
        }
        console.warn("RGBAB.fromColorName - Could not find color ", name);
        return new RGBAB(255, 255, 255, alpha, brightness);
    };
    RGBAB.Colors = { "red": { R: 255, G: 0, B: 0 },
        "green": { R: 0, G: 255, B: 0 },
        "blue": { R: 0, G: 0, B: 255 },
        "black": { R: 0, G: 0, B: 0 }
    };
    return RGBAB;
}());
exports.RGBAB = RGBAB;
//# sourceMappingURL=rgbab.js.map