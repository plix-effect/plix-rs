export type ClientPacket =
    | ClientBeginSendFilePacket
    | ClientRequestFilesPacket
    | ClientSelectPlixPacket
    ;


export type ClientPacketWithId = {
    _packetId: string
}

export type ClientBeginSendFilePacket = ClientPacketWithId & {
    _type: "beginSendFile"
    name: string,
    size: number // in bytes
}

export type ClientRequestFilesPacket = ClientPacketWithId & {
    _type: "requestFiles"
}

export type ClientSelectPlixPacket = ClientPacketWithId & {
    _type: "selectPlix",
    fileName: string
}