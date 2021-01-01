"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_logger_1 = __importDefault(require("js-logger"));
js_logger_1.default.useDefaults({
    defaultLevel: js_logger_1.default.INFO,
    formatter: function (messages, context) {
        var date = new Date();
        messages.unshift("[" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "]");
        messages.unshift("[" + context.level.name + "]");
        messages.unshift("[" + (context.name || "Default") + "]");
    }
});
//# sourceMappingURL=logger-setup.js.map