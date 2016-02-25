var RGBB = (function () {
    function RGBB(R, G, B, BB) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.BB = BB;
    }
    RGBB.prototype.setRGBB = function (color) {
        this.R = color.R;
        this.G = color.G;
        this.B = color.B;
        this.BB = color.BB;
    };
    RGBB.fromColorName = function (name, brightness) {
        if (brightness === void 0) { brightness = 31; }
        var color = RGBB.Colors[name.toLowerCase()];
        if (color) {
            return new RGBB(color.R, color.G, color.B, brightness);
        }
        console.warn("RGBB.fromColorName - Could not find color ", name);
        return new RGBB(255, 255, 255, brightness);
    };
    RGBB.Colors = { "red": { R: 255, G: 0, B: 0 },
        "green": { R: 0, G: 255, B: 0 },
        "blue": { R: 0, G: 0, B: 255 }
    };
    return RGBB;
})();
exports.RGBB = RGBB;
//# sourceMappingURL=rgbb.js.map