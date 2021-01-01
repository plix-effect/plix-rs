"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWSClient = void 0;
var TypedEventEmitter_1 = require("../utils/TypedEventEmitter");
var text_decoding_1 = require("text-decoding");
var createWSClient = function (ws) {
    var obj = Object.create(new TypedEventEmitter_1.TypedEventEmitter());
    var client = obj;
    var emitter = obj;
    ws.on("message", function (msg) {
        if (typeof msg === "string") {
            handleStringMessage(msg);
        }
        else if (msg instanceof Buffer) {
            handleFileReceiving(msg);
        }
    });
    var handleStringMessage = function (msg) {
        var obj;
        try {
            obj = JSON.parse(msg);
        }
        catch (e) {
            ws.send("Bad packet");
            ws.close(1002);
            console.warn("CLOSING because cant parse");
            return;
        }
        if (typeof obj !== "object" || !obj._type) {
            ws.send("Bad packet");
            ws.close(1002);
            console.warn("CLOSING because bad packet", obj);
            return;
        }
        emitter.emit("packet", obj);
    };
    var handleFileReceiving = function (msg) {
        var offset = 0;
        var packetIdSize = msg.readUInt32LE(offset);
        var packetIdBuff = msg.subarray(offset + 4, offset + 4 + packetIdSize);
        var packetId = ab2str(packetIdBuff);
        offset += 4 + packetIdSize;
        var nameSize = msg.readUInt32LE(offset);
        var nameBuffer = msg.subarray(offset + 4, offset + 4 + nameSize);
        var name = ab2str(nameBuffer);
        offset += 4 + nameSize;
        var data = msg.subarray(offset);
        emitter.emit("packet", {
            _type: "uploadFile",
            _packetId: packetId,
            file: data,
            fileName: name
        });
    };
    ws.on("close", function () {
        emitter.emit("close");
    });
    client.close = function () {
        ws.close(1000);
    };
    client.send = function (packet) {
        var str = JSON.stringify(packet);
        ws.send(str);
    };
    return client;
};
exports.createWSClient = createWSClient;
var textDecoder = new text_decoding_1.TextDecoder();
function ab2str(buf) {
    return textDecoder.decode(buf);
}
//# sourceMappingURL=WSClient.js.map