"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaspberryAdafruitService = void 0;
var AbstractAdafruitService_1 = require("./AbstractAdafruitService");
var color_1 = require("@plix-effect/core/color");
var ws281x = require('rpi-ws281x-v2');
var RaspberryAdafruitService = /** @class */ (function (_super) {
    __extends(RaspberryAdafruitService, _super);
    function RaspberryAdafruitService(config) {
        var _this = _super.call(this, config) || this;
        ws281x.configure(config);
        _this.config = config;
        return _this;
    }
    RaspberryAdafruitService.prototype.write = function (data) {
        for (var i = 0; i < data.length; i++) {
            var _a = color_1.numberToRgba(data[i]), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
            data[i] = color_1.rgbaToNumber({ r: r * a, g: g * a, b: b * a, a: 0 }) >> 8;
        }
        ws281x.render(data);
    };
    RaspberryAdafruitService.prototype.getPixelCount = function () {
        return this.config.leds || 1;
    };
    RaspberryAdafruitService.prototype.clear = function () {
        var arr = new Uint32Array(this.config.leds || 10);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = 0;
        }
        this.write(arr);
    };
    return RaspberryAdafruitService;
}(AbstractAdafruitService_1.AbstractAdafruitService));
exports.RaspberryAdafruitService = RaspberryAdafruitService;
//# sourceMappingURL=RaspberryAdafruitService.js.map