
export interface ClientPacket {
    _type: string
}

export interface ClientPacketWithId extends ClientPacket {
    _packetId: string
}

export interface ClientBeginSendFilePacket extends ClientPacketWithId {
    type: "beginSendFile"
    name: string,
    size: number // in bytes
}

export interface ClientRequestFilesPacket extends ClientPacketWithId {
    type: "requestFiles"
}

export interface ClientSelectPlixPacket extends ClientPacket {
    type: "selectPlix",
    fileName: string
}