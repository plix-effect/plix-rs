import {IPublicTypedEventEmitter, ITypedEventEmitter, TypedEventEmitter} from "../utils/TypedEventEmitter";
import WebSocket from "ws";
import {EventEmitter} from "events";
import {ClientPacket, EventPacket, EventPacketMap, RequestPacketMap, ServerAnswerPacket} from "../../../typings/Packets";

export interface IWSClientEvents {
    close: () => void;
    packet: (packet: ClientPacket) => void;
}

export interface IWSClient extends ITypedEventEmitter<IWSClientEvents>{
    close();
    send(packet: EventPacket | ServerAnswerPacket): void;
}

export const createWSClient = (ws: WebSocket): IWSClient => {

    const obj = Object.create(new TypedEventEmitter());
    const client = obj as IWSClient;
    const emitter = obj as IPublicTypedEventEmitter<IWSClientEvents>;

    ws.on("message", (msg) => {
        if (typeof msg === "string") {
            handleStringMessage(msg)
        } else if (msg instanceof Buffer)  {
            console.log("BUFFER LEN", msg.length)
            handleFileReceiving(msg);
        }
    });

    const handleStringMessage = (msg: string) => {
        let obj;
        try {
            obj = JSON.parse(msg);
        } catch (e) {
            ws.send("Bad packet")
            ws.close(1002);
            console.warn("CLOSING because cant parse" )
            return;
        }
        if (typeof obj !== "object" || !obj._type) {
            ws.send("Bad packet");
            ws.close(1002);
            console.warn("CLOSING because bad packet", obj);
            return;
        }
        emitter.emit("packet", obj)
    }

    const handleFileReceiving = (msg: Buffer) => {
        let offset = 0;
        const packetIdSize = msg.readUInt32LE(offset);
        const packetIdBuff = msg.subarray(offset+4,offset+4+packetIdSize);
        const packetId = ab2str(packetIdBuff);
        offset += 4+packetIdSize;

        const nameSize = msg.readUInt32LE(offset);
        const nameBuffer = msg.subarray(offset+4,offset+4+nameSize);
        const name = ab2str(nameBuffer);
        offset += 4+nameSize;

        const data = msg.subarray(offset);
        emitter.emit("packet", {
            _type: "uploadFile",
            _packetId: packetId,
            file: data,
            fileName: name
        })
    }

    ws.on("close", () => {
        emitter.emit("close");
    })

    client.close = () => {
        ws.close(1000);
    }

    client.send = (packet) => {
        const str = JSON.stringify(packet);
        ws.send(str);
    }

    return client;
}

const textDecoder = new TextDecoder();
function ab2str(buf) {
    return textDecoder.decode(buf);
}