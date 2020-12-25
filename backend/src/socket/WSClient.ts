import {IPublicTypedEventEmitter, ITypedEventEmitter, TypedEventEmitter} from "../utils/TypedEventEmitter";
import WebSocket from "ws";
import {EventEmitter} from "events";
import {ClientPacket} from "../../../typings/ClientPackets";
import {ServerPacket} from "../../../typings/ServerPackets";
import {cli} from "webpack";

export interface IWSClientEvents {
    close: () => void;
    packet: (packet: ClientPacket) => void;
    file: (data: Buffer) => void;
}

export interface IWSClient extends ITypedEventEmitter<IWSClientEvents>{
    close();
    send(packet: ServerPacket): void;
}

export const createWSClient = (ws: WebSocket): IWSClient => {

    const obj = Object.create(new TypedEventEmitter());
    const client = obj as IWSClient;
    const emitter = obj as IPublicTypedEventEmitter<IWSClientEvents>;

    ws.on("message", (msg) => {
        if (typeof msg === "string") {
            handleStringMessage(msg)
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