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
        if (obj._type == "playerState") console.log("PACKET",obj)
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

    const sendFile = (fileName: string, fileData: ArrayBuffer): string => {
        const packetId = generateNewPacketId();
        const packetIdBuff = str2ab(packetId);
        const packetIdSizeBuf = (new Uint32Array([packetIdBuff.byteLength])).buffer;
        const nameArrBuffer = str2ab(fileName);
        const nameSizeArrBuffer = (new Uint32Array([nameArrBuffer.byteLength])).buffer;
        const finalArrayBuffer = joinArrayBuffers(packetIdSizeBuf, packetIdBuff, nameSizeArrBuffer, nameArrBuffer, fileData);
        console.log("SENDING",packetId,fileName)
        ws.send(finalArrayBuffer);
        return packetId;
    }

    const send = <T extends keyof ClientPacketMap>(type: T, pp: Omit<ClientPacket<T>, "_type" | "_packetId">): string => {
        if (type === "uploadFile") {
            const uploadPacket = pp as any as ClientPacket<"uploadFile">;
            return sendFile(uploadPacket.fileName, uploadPacket.file);
        }
        const id = generateNewPacketId();
        const packet = {...pp, _packetId: id, _type: type}
        const str = JSON.stringify(packet);
        ws.send(str);
        return id;
    }

    client.send = (type, pp) => {
        send(type, pp);
    }

    client.sendRequestPacket = async (type, pp) => {
        const id = send(type, pp);
        return new Promise((r,j) => {
            const listener = (serverPacket: PacketAnswer<any>) => {
                if (serverPacket._type !== "answer") return;
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

const enc = new TextEncoder();
function str2ab(str) {
    return enc.encode(str).buffer;
}

const joinArrayBuffers = (...buffers: ArrayBuffer[]): ArrayBuffer => {
    const size = buffers.map(it => it.byteLength).reduce((prev, cur) => prev+cur, 0);
    var tmp = new Uint8Array(size);
    let curOffset = 0;
    buffers.forEach((b, i) => {
        tmp.set(new Uint8Array(b), curOffset);
        curOffset += b.byteLength;
    })
    console.log("BUFFERS", buffers);
    console.log("CONCATED", tmp.buffer);
    return tmp.buffer;
};

