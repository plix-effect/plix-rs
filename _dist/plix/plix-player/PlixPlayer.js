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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlixPlayer = void 0;
var parser_1 = __importDefault(require("@plix-effect/core/dist/parser"));
var effectConstructorMap = __importStar(require("@plix-effect/core/effects"));
var filterConstructorMap = __importStar(require("@plix-effect/core/filters"));
var TypedEventEmitter_1 = require("../../utils/TypedEventEmitter");
var color_1 = require("@plix-effect/core/color");
var RENDER_INTERVAL_MS = 20; //ms
var PlixPlayer = /** @class */ (function (_super) {
    __extends(PlixPlayer, _super);
    function PlixPlayer(plixFileManager, adafruitService, musicPlayer) {
        var _this = _super.call(this) || this;
        _this.state = {};
        _this.playFromTimestamp = 0; // in ms
        _this.pauseTime = 0; // in ms
        _this.doTick = function () {
            if (_this.state.status != "play")
                return;
            var dif = process.uptime() * 1000 - _this.playFromTimestamp;
            if (dif >= _this.currentDuration) {
                // TODo if playlist - go next;
                _this.stop();
                return;
            }
            _this.tickProcessId = setTimeout(_this.doTick, RENDER_INTERVAL_MS);
            _this.render();
        };
        _this.plixFileManager = plixFileManager;
        _this.adafruitService = adafruitService;
        _this.musicPlayer = musicPlayer;
        return _this;
    }
    PlixPlayer.prototype.getState = function () {
        return __assign({}, this.state);
    };
    PlixPlayer.prototype.selectTrack = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // ToDo parse
                        this.state = {
                            volume: this.musicPlayer.getState().volume,
                        };
                        this.adafruitService.clear();
                        this.state.status = "loading";
                        this.emit("state", this.state);
                        return [4 /*yield*/, this.parsePlixFile(file)];
                    case 1:
                        _a.sent();
                        if (this.parsedRenderResult == null) {
                            this.state.status = null;
                            return [2 /*return*/, this.state];
                        }
                        this.musicPlayer.stop();
                        this.state = {
                            status: "stop",
                            volume: this.musicPlayer.getState().volume,
                            playingObject: {
                                type: "track",
                                track: {
                                    file: file,
                                    name: file
                                }
                            },
                            playFromTime: undefined,
                            duration: this.currentDuration
                        };
                        this.emit("state", this.state);
                        return [2 /*return*/, this.state];
                }
            });
        });
    };
    PlixPlayer.prototype.setVolume = function (vol) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.musicPlayer.setVolume(vol)];
            });
        });
    };
    PlixPlayer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playinObj, fileName, fullFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (["play", "loading", null].includes(this.state.status))
                            return [2 /*return*/];
                        if (!this.parsedRenderResult)
                            return [2 /*return*/];
                        playinObj = this.state.playingObject;
                        if ((playinObj === null || playinObj === void 0 ? void 0 : playinObj.type) !== "track")
                            return [2 /*return*/];
                        fileName = playinObj.track.file;
                        fullFilePath = this.plixFileManager.getFullFilePath(fileName);
                        if (!this.isCurrentFileMP3) return [3 /*break*/, 2];
                        if (!(this.musicPlayer.getState().file !== fullFilePath || this.state.status === "stop")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.musicPlayer.startFile(fullFilePath)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.isCurrentFileMP3) {
                            this.musicPlayer.play();
                        }
                        this.playFromTimestamp = process.uptime() * 1000 - this.pauseTime;
                        this.pauseTime = 0;
                        this.state = __assign(__assign({}, this.state), { status: "play", playFromTime: this.playFromTimestamp, pauseTime: undefined });
                        this.emit("state", this.state);
                        this.doTick();
                        return [2 /*return*/];
                }
            });
        });
    };
    PlixPlayer.prototype.pause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.state.status !== "play")
                    return [2 /*return*/];
                this.pauseTime = this.currentTime;
                this.state = __assign(__assign({}, this.state), { status: "pause", pauseTime: this.pauseTime });
                if (this.isCurrentFileMP3) {
                    this.musicPlayer.pause();
                }
                this.emit("state", this.state);
                return [2 /*return*/];
            });
        });
    };
    PlixPlayer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.state = __assign(__assign({}, this.state), { status: "stop", pauseTime: undefined, playFromTime: undefined });
                this.pauseTime = 0;
                if (this.isCurrentFileMP3) {
                    this.musicPlayer.stop();
                }
                this.adafruitService.clear();
                this.emit("state", this.state);
                return [2 /*return*/];
            });
        });
    };
    PlixPlayer.prototype.seek = function (timeMs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.state.status === "play") {
                    this.playFromTimestamp -= timeMs;
                    this.state = __assign(__assign({}, this.state), { playFromTime: this.playFromTimestamp });
                }
                else {
                    this.pauseTime = timeMs;
                    this.state = __assign(__assign({}, this.state), { playFromTime: this.playFromTimestamp, pauseTime: this.pauseTime, status: "pause" });
                }
                if (this.isCurrentFileMP3) {
                    this.musicPlayer.seek(timeMs / 1000);
                }
                this.emit("state", this.state);
                return [2 /*return*/];
            });
        });
    };
    PlixPlayer.prototype.render = function () {
        var _a;
        var dif = this.currentTime;
        var effect = (_a = this.parsedRenderResult) === null || _a === void 0 ? void 0 : _a.effect;
        if (!effect)
            return;
        var lineMod = effect(dif, this.currentDuration, 0);
        var pixelCount = this.adafruitService.getPixelCount();
        var uArr = new Uint32Array(pixelCount);
        for (var i = 0; i < pixelCount; i++) {
            var colorMod = lineMod(i, pixelCount);
            var color = colorMod(color_1.BLACK);
            uArr[i] = color_1.toNumber(color);
        }
        this.adafruitService.write(uArr);
    };
    PlixPlayer.prototype.parsePlixFile = function (file, profileName) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.plixFileManager.readJsonFromFile(file)];
                    case 1:
                        data = _a.sent();
                        if (data === null)
                            return [2 /*return*/, null];
                        this.loadedRender = data;
                        this.parsedRenderResult = parser_1.default(data["render"], data["effects"], data["filters"], effectConstructorMap, filterConstructorMap, data["profiles"], profileName);
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(PlixPlayer.prototype, "isCurrentFileMP3", {
        get: function () {
            var playinObj = this.state.playingObject;
            if ((playinObj === null || playinObj === void 0 ? void 0 : playinObj.type) !== "track")
                return false;
            var fileName = playinObj.track.file;
            return fileName.endsWith(".mp3");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlixPlayer.prototype, "currentDuration", {
        get: function () {
            return this.loadedRender ? this.loadedRender["editor"]["duration"] : -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PlixPlayer.prototype, "currentTime", {
        get: function () {
            return process.uptime() * 1000 - this.playFromTimestamp;
        },
        enumerable: false,
        configurable: true
    });
    return PlixPlayer;
}(TypedEventEmitter_1.TypedEventEmitter));
exports.PlixPlayer = PlixPlayer;
//# sourceMappingURL=PlixPlayer.js.map