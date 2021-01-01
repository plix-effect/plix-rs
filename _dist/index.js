"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var RSServer_1 = require("./RSServer");
var PlixFileManager_1 = require("./PlixFileManager");
var adafruit_1 = require("./plix/adafruit");
var PlixPlayer_1 = require("./plix/plix-player/PlixPlayer");
var MPlayerService_1 = require("./music/MPlayerService");
var config_json_1 = __importDefault(require("./config.json"));
var minimist_1 = __importDefault(require("minimist"));
var args = minimist_1.default(process.argv);
var config = Object.create(config_json_1.default);
var putArgToConfig = function (argName) {
    if (args.hasOwnProperty(argName))
        config[argName] = args[argName];
};
["port", "stripLength", "stripScheme", "stripConnection"].forEach(function (argName) {
    putArgToConfig(argName);
});
var plixFileManager = PlixFileManager_1.createPlixFileManager();
var adafruitService = new adafruit_1.AdafruitService({ leds: config.stripLength, strip: config.stripScheme });
var plixPlayer = new PlixPlayer_1.PlixPlayer(plixFileManager, adafruitService, new MPlayerService_1.MPlayerService());
var app = RSServer_1.createRSServer({ plixPlayer: plixPlayer, plixFileManager: plixFileManager });
app.listen(config.port, function () {
    console.info("PLIX-RS app listening at http://localhost:" + config.port);
});
//
// import {PlixPlayer} from "./plix/plix-player/PlixPlayer";
// import {createPlixFileManager} from "./PlixFileManager";
// import {AdafruitService} from "./plix/adafruit";
// import path from "path";
// import {MPlayerService} from "./music/MPlayerService";
//
// const plixFileManager = createPlixFileManager();
// const adafruitService = new AdafruitService({leds: 10});
// const mplayer = new MPlayerService()
// const plixPlayer = new PlixPlayer(plixFileManager, adafruitService, mplayer);
//
//
// const doTest = async () => {
//     mplayer.startFile(plixFileManager.getFullFilePath("1.mp3"));
//     setTimeout(() => {
//         console.log("STOP")
//         mplayer.stop();
//         setTimeout(() => {
//             console.log("PLAY AGAIN")
//             mplayer.play();
//         }, 1500)
//     }, 1500)
// }
//
// doTest();
//# sourceMappingURL=index.js.map