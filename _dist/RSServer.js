"use strict";
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
exports.createRSServer = void 0;
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
var path_1 = __importDefault(require("path"));
var WSClient_1 = require("./socket/WSClient");
var connectedClients = [];
var createRSServer = function (_a) {
    var plixFileManager = _a.plixFileManager, plixPlayer = _a.plixPlayer;
    var expressApp = express_1.default();
    var expressWsApp = express_ws_1.default(expressApp).app;
    expressApp.use(body_parser_1.default.json());
    expressApp.use(cors_1.default());
    var root = path_1.default.join(__dirname, "web");
    expressWsApp.get('/cover/*', function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, coverData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileName = decodeURIComponent(req.path.substr(7));
                        return [4 /*yield*/, plixFileManager.getMp3Cover(fileName)];
                    case 1:
                        coverData = _a.sent();
                        res.setHeader('content-type', 'image/png');
                        if (!coverData) {
                            res.sendFile(path_1.default.join(root, "assets", "image", "default_cover.jpg"));
                            return [2 /*return*/];
                        }
                        res.send(coverData);
                        return [2 /*return*/];
                }
            });
        });
    });
    console.log("X");
    expressWsApp.ws("/api", function (ws, req) {
        var client = WSClient_1.createWSClient(ws);
        connectedClients.push(client);
        client.on("close", function () {
            connectedClients.splice(connectedClients.indexOf(client), 1);
        });
        client.on("packet", function (packet) { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handlePacket(client, packet)];
                    case 1:
                        answer = _a.sent();
                        if (answer == null)
                            return [2 /*return*/];
                        client.send(answer);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    var broadcastPacket = function (packet) {
        connectedClients.forEach(function (client) {
            client.send(packet);
        });
    };
    var broadcastFilesChanged = function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, plixFileManager.getFileList()];
                case 1:
                    files = _a.sent();
                    broadcastPacket({
                        "_type": "filesChanged",
                        files: files
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePacket = function (ws, packet) { return __awaiter(void 0, void 0, void 0, function () {
        var fileList, file, status_1, time, state, fileName, file, fileName, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(packet._type === "requestFiles")) return [3 /*break*/, 2];
                    return [4 /*yield*/, plixFileManager.getFileList()];
                case 1:
                    fileList = _a.sent();
                    return [2 /*return*/, {
                            _type: "answer",
                            _clientPacketType: "requestFiles",
                            _packetId: packet._packetId,
                            files: fileList
                        }];
                case 2:
                    if (!(packet._type === "selectPlix")) return [3 /*break*/, 3];
                    file = packet.file;
                    plixPlayer.selectTrack(file);
                    return [2 /*return*/, null];
                case 3:
                    if (!(packet._type === "changePlayStatus")) return [3 /*break*/, 4];
                    status_1 = packet.status;
                    if (status_1 === "play")
                        plixPlayer.start();
                    else if (status_1 === "pause")
                        plixPlayer.pause();
                    else if (status_1 === "stop")
                        plixPlayer.stop();
                    return [2 /*return*/, null];
                case 4:
                    if (!(packet._type === "playerSeek")) return [3 /*break*/, 5];
                    time = packet.time;
                    plixPlayer.seek(time);
                    return [2 /*return*/, null];
                case 5:
                    if (!(packet._type === "requestPlayerState")) return [3 /*break*/, 6];
                    state = plixPlayer.getState();
                    return [2 /*return*/, {
                            _type: "answer",
                            _clientPacketType: packet._type,
                            _packetId: packet._packetId,
                            state: state
                        }];
                case 6:
                    if (!(packet._type === "beginSendFile")) return [3 /*break*/, 7];
                    return [2 /*return*/, {
                            _type: "answer",
                            _clientPacketType: packet._type,
                            _packetId: packet._packetId,
                            allow: false,
                            reason: "Not realisation for sending file yet"
                        }];
                case 7:
                    if (!(packet._type === "syncTime")) return [3 /*break*/, 8];
                    return [2 /*return*/, {
                            _type: "answer",
                            _packetId: packet._packetId,
                            _clientPacketType: packet._type,
                            time: process.uptime() * 1000
                        }];
                case 8:
                    if (!(packet._type === "uploadFile")) return [3 /*break*/, 10];
                    fileName = packet.fileName, file = packet.file;
                    if (!fileName.endsWith("mp3") && !fileName.endsWith("json")) {
                        return [2 /*return*/, {
                                _type: "answer",
                                _packetId: packet._packetId,
                                _clientPacketType: packet._type,
                                success: false,
                                reason: "Only mp3 and json files allowed"
                            }];
                    }
                    return [4 /*yield*/, plixFileManager.uploadFile(fileName, file)];
                case 9:
                    _a.sent();
                    broadcastFilesChanged();
                    return [2 /*return*/, {
                            _type: "answer",
                            _packetId: packet._packetId,
                            _clientPacketType: packet._type,
                            success: true,
                        }];
                case 10:
                    if (!(packet._type === "removeFile")) return [3 /*break*/, 15];
                    fileName = packet.fileName;
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, plixFileManager.removeFile(fileName)];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_1 = _a.sent();
                    return [2 /*return*/, {
                            _type: "answer",
                            _packetId: packet._packetId,
                            _clientPacketType: packet._type,
                            success: false,
                            reason: e_1.toString()
                        }];
                case 14:
                    broadcastFilesChanged();
                    return [2 /*return*/, {
                            _type: "answer",
                            _packetId: packet._packetId,
                            _clientPacketType: packet._type,
                            success: true,
                        }];
                case 15: return [2 /*return*/, null];
            }
        });
    }); };
    plixPlayer.on("state", function (state) {
        broadcastPacket({
            _type: "playerState",
            state: state
        });
    });
    expressApp.use(express_1.default.static(root));
    expressApp.use(connect_history_api_fallback_1.default({ root: root }));
    return expressWsApp;
};
exports.createRSServer = createRSServer;
//# sourceMappingURL=RSServer.js.map