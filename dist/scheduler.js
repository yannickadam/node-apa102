"use strict";
var Scheduler = (function () {
    function Scheduler(strip) {
        this.queue = [];
        this.currentIndex = 0;
        this.playing = false;
        this.strip = strip;
    }
    Scheduler.prototype.play = function (loop) {
        if (loop === void 0) { loop = false; }
        if (this.queue.length > 0) {
            var nextAction = this.queue[this.currentIndex];
            var currentTime = Date.now();
            this.playing = true;
            this.timer = setTimeout(this._play_internal.bind(this), nextAction.time);
        }
        else {
            console.warn("Nothing to play in queue.");
        }
    };
    Scheduler.prototype._play_internal = function () {
        var action = this.queue[this.currentIndex];
        var method = this.strip[action.command.method];
        method.apply(this.strip, action.command.params);
        console.log("Playing action:", action.command.method, "with params", action.command.params);
        this.currentIndex++;
        if (this.currentIndex < this.queue.length) {
            var nextAction = this.queue[this.currentIndex];
            this.timer = setTimeout(this._play_internal.bind(this), nextAction.time);
        }
        else {
            this.currentIndex = 0;
            this.playing = false;
        }
    };
    Scheduler.prototype.pause = function () {
    };
    Scheduler.prototype.add = function (command, time) {
        var element = { command: command, time: time };
        for (var i = 0; i < this.queue.length; i++) {
            var qc = this.queue[i];
            if (time < qc.time) {
                this.queue.splice(i, 0, element);
                return;
            }
        }
        this.queue.push(element);
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
//# sourceMappingURL=scheduler.js.map