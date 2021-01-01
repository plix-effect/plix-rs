"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMp3Json = exports.readMp3Json = void 0;
var mp3tag_js_1 = __importDefault(require("mp3tag.js"));
var pako_1 = require("pako");
var OWNER_ID = "plix-effect";
function readMp3Json(buffer) {
    var mp3tag = new mp3tag_js_1.default(buffer, false);
    mp3tag.read();
    var priv = mp3tag.tags.v2.PRIV;
    if (!priv)
        return null;
    var plixTag = priv.find(function (tag) { return tag.ownerId === OWNER_ID; });
    if (!plixTag)
        return null;
    try {
        var text = pako_1.inflate(plixTag.data, { to: 'string' });
        return JSON.parse(text);
    }
    catch (_a) { }
    return null;
}
exports.readMp3Json = readMp3Json;
function setMp3Json(buffer, json) {
    var mp3tag = new mp3tag_js_1.default(buffer, false);
    mp3tag.read();
    mp3tag.tags.v2.PRIV = [{
            ownerId: OWNER_ID + "\0",
            data: pako_1.deflate(JSON.stringify(json)),
        }];
    mp3tag.save();
    return mp3tag.buffer;
}
exports.setMp3Json = setMp3Json;
//# sourceMappingURL=Mp3Meta.js.map