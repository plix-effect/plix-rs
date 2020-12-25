import {ClientPacket} from "../../../typings/ClientPackets";
import {ServerPacket} from "../../../typings/ServerPackets";
import {IPublicTypedEventEmitter, ITypedEventEmitter} from "../utils/TypedEventEmitter";
import {TypedEventEmitter} from "../../../backend/src/utils/TypedEventEmitter";

export interface IWSClientEvents {
    close: (code: number, reason: string) => void;
    packet: (packet: ServerPacket) => void;
}

export interface IWSClient extends ITypedEventEmitter<IWSClientEvents>{
    close();
    send(packet: ClientPacket): void;
}


export const createWSClient = (address: string): IWSClient => {

    const obj = Object.create(new TypedEventEmitter());
    const emitter = obj as IPublicTypedEventEmitter<IWSClientEvents>;
    const client = obj as IWSClient;
    const ws = new WebSocket(address);

    ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (typeof msg === "string") {
            console.error("Closing websocket. Server last send:",msg)
            ws.close();
            return;
        }
    }

    ws.onclose = (ev) => {
        emitter.emit("close", ev.code, ev.reason)
    }

    client.close = () => {
        ws.close(1000);
    }

    client.send = (packet) => {
        const str = JSON.stringify(packet);
        ws.send(str);
    }

    return client;
}