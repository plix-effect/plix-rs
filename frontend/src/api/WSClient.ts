import {IPublicTypedEventEmitter, ITypedEventEmitter} from "../utils/TypedEventEmitter";
import {TypedEventEmitter} from "../../../backend/src/utils/TypedEventEmitter";
import {cli} from "webpack";
import {generateNewPacketId} from "../utils/packet-utils";
import {
    ClientPacket,
    ClientPacketMap,
    EventPacket,
    PacketAnswer,
    ServerAnswerPacket,
    ServerAnswerPacketMap
} from "../../../typings/Packets";

export interface IWSClientEvents {
    close: (code: number, reason: string) => void;
    packet: (packet: EventPacket) => void;
    answerPacket: (packet: ServerAnswerPacket) => void;
    open: () => void;
}

export interface IWSClient extends ITypedEventEmitter<IWSClientEvents>{
    close();
    send<T extends keyof ClientPacketMap>(type: T, packet: Omit<ClientPacket<T>, "_type" | "_packetId">): void;
    sendRequestPacket<T extends keyof ClientPacketMap>(type: T, packet: Omit<ClientPacket<T>, "_type" | "_packetId">): Promise<ServerAnswerPacketMap[T]>;
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
        if (obj._type === "answer") {
            emitter.emit("answerPacket", obj);
        } else {
            emitter.emit("packet", obj);
        }
    }


    ws.onclose = (ev) => {
        emitter.emit("close", ev.code, ev.reason)
    }

    client.close = () => {
        ws.close(1000);
    }

    client.send = (type, pp) => {
        const id = generateNewPacketId();
        const packet = {...pp, _packetId: id, _type: type}
        const str = JSON.stringify(packet);
        ws.send(str);
    }

    client.sendRequestPacket = async (type, pp) => {
        const id = generateNewPacketId();
        const packet = {...pp, _packetId: id, _type: type}
        const str = JSON.stringify(packet);
        ws.send(str);
        return new Promise((r,j) => {
            const listener = (serverPacket: PacketAnswer<any>) => {
                if (serverPacket._type !== "answer") return;
                console.log("RESPONSE", serverPacket);
                if (serverPacket._packetId != id) return;
                if (serverPacket._error) {
                    j(serverPacket._error)
                } else {
                    r(serverPacket as any)
                }
                client.off("answerPacket", listener);
            }
            client.on("answerPacket", listener)
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