"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    RGBAB.fromHSL = function (h, sl, l) {
        var r = l;
        var g = l;
        var b = l;
        var v = (l <= 0.5) ? (l * (1.0 + sl)) : (l + sl - l * sl);
        if (v > 0) {
            var m = l + l - v;
            var sv = (v - m) / v;
            h *= 6.0;
            var sextant = Math.floor(h);
            var fract = h - sextant;
            var vsf = v * sv * fract;
            var mid1 = m + vsf;
            var mid2 = v - vsf;
            switch (sextant) {
                case 0:
                    r = v;
                    g = mid1;
                    b = m;
                    break;
                case 1:
                    r = mid2;
                    g = v;
                    b = m;
                    break;
                case 2:
                    r = m;
                    g = v;
                    b = mid1;
                    break;
                case 3:
                    r = m;
                    g = mid2;
                    b = v;
                    break;
                case 4:
                    r = mid1;
                    g = m;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = m;
                    b = mid2;
                    break;
            }
        }
        return new RGBAB(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255), 1, 31);
    };
    return RGBAB;
}());
RGBAB.Colors = { "red": { R: 255, G: 0, B: 0 },
    "green": { R: 0, G: 255, B: 0 },
    "blue": { R: 0, G: 0, B: 255 },
    "black": { R: 0, G: 0, B: 0 }
};
exports.RGBAB = RGBAB;
//# sourceMappingURL=rgbab.js.map