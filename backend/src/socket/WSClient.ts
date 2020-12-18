import {IPublicTypedEventEmitter, ITypedEventEmitter, TypedEventEmitter} from "../utils/TypedEventEmitter";
import WebSocket from "ws";
import type {ClientPacket} from "../../../shared/ClientPackets";
import {EventEmitter} from "events";
import {ServerAnswerPacket, ServerNotifyPacket} from "../../../shared/ServerPackets";

interface IWSClientEvents {
    close: () => void;
    packet: (packet: ClientPacket) => void;
    file: (data: Buffer) => void;
}

interface IWSClient extends ITypedEventEmitter<any>{
    close();
    send(packet: (ServerNotifyPacket|ServerAnswerPacket)): void;
}

export const createWSClient = (ws: WebSocket): IWSClient => {

    const wsClient = Object.create(new TypedEventEmitter());
    const emitter = wsClient as IPublicTypedEventEmitter<IWSClientEvents>;

    ws.on("message", (msg) => {
        console.log(msg);
    });

    ws.on("close", () => {
        emitter.emit("close");
    })

    wsClient.close = () => {
        ws.close();
    }

    return null as any;
}