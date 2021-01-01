"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdafruitService = void 0;
exports.AdafruitService = process.platform === "linux" ?
    require('./RaspberryAdafruitService').RaspberryAdafruitService :
    require('./DummyAdafruitService').DummyAdafruitService;
//# sourceMappingURL=index.js.map