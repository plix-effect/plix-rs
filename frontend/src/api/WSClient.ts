import {ClientPacket, ClientPacketWithId} from "../../../typings/ClientPackets";
import {ServerPacket} from "../../../typings/ServerPackets";
import {IPublicTypedEventEmitter, ITypedEventEmitter} from "../utils/TypedEventEmitter";
import {TypedEventEmitter} from "../../../backend/src/utils/TypedEventEmitter";
import {cli} from "webpack";

export interface IWSClientEvents {
    close: (code: number, reason: string) => void;
    packet: (packet: ServerPacket) => void;
    open: () => void;
}

export interface IWSClient extends ITypedEventEmitter<IWSClientEvents>{
    close();
    send(packet: ClientPacket): void;
    sendRequestPacket(packet: (ClientPacket & ClientPacketWithId)): Promise<ServerPacket>;
    status: WebSocket["readyState"];
    ready: boolean
}


export const createWSClient = async (address: string): Promise<IWSClient> => {

    const obj = Object.create(new TypedEventEmitter());
    const emitter = obj as IPublicTypedEventEmitter<IWSClientEvents>;
    const client = obj as IWSClient;
    const ws = new WebSocket(address);

    ws.onmessage = (ev) => {
        const data = ev.data;
        if (typeof data === "string") {
            handleStringMessage(data);
        }
    }

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
        console.log("PACKET",obj)
        emitter.emit("packet", obj)
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
    client.sendRequestPacket = async (packet) => {
        const str = JSON.stringify(packet);
        ws.send(str);
        return new Promise((r,j) => {
            const listener = (serverPacket: ServerPacket) => {
                if (serverPacket._type !== "answer") return;
                if (serverPacket._packetId == null || serverPacket._packetId != packet._packetId) return;
                if (serverPacket._error) {
                    j(serverPacket._error)
                } else {
                    r(serverPacket)
                }
                client.off("packet", listener);
            }
            client.on("packet", listener)
        })
    }

    Object.defineProperty(client, "status", {
        get(): any {
            return ws.readyState
        }
    })
    Object.defineProperty(client, "ready", {
        get(): any {
            return ws.readyState === 1
        }
    })

    return new Promise((r,j) => {
        ws.onopen = () => {
            r(client)
            ws.onclose = ws.onclose = undefined;
        }
        ws.onclose = (e) => {
            j(e)
        }
    })
}