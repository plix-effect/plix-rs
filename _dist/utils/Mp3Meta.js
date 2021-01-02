"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMp3CoverImage = exports.readMp3Json = void 0;
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
function readMp3CoverImage(buffer) {
    var _a, _b;
    var mp3tag = new mp3tag_js_1.default(buffer, false);
    mp3tag.read();
    var apic = (_b = (_a = mp3tag.tags) === null || _a === void 0 ? void 0 : _a.v2) === null || _b === void 0 ? void 0 : _b.APIC;
    if (!apic || apic.length == 0)
        return null;
    var coverData = apic[0].data;
    return new Buffer(coverData);
}
exports.readMp3CoverImage = readMp3CoverImage;
//# sourceMappingURL=Mp3Meta.js.map