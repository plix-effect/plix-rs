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
exports.DummyAdafruitService = void 0;
var AbstractAdafruitService_1 = require("./AbstractAdafruitService");
var DummyAdafruitService = /** @class */ (function (_super) {
    __extends(DummyAdafruitService, _super);
    function DummyAdafruitService(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        console.warn("DummyAdafruitService has no realisation of any methods");
        return _this;
    }
    DummyAdafruitService.prototype.write = function (data) { };
    DummyAdafruitService.prototype.getPixelCount = function () {
        return this.config.leds || 1;
    };
    DummyAdafruitService.prototype.clear = function () { };
    return DummyAdafruitService;
}(AbstractAdafruitService_1.AbstractAdafruitService));
exports.DummyAdafruitService = DummyAdafruitService;
//# sourceMappingURL=DummyAdafruitService.js.map