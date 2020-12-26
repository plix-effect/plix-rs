import {PlayerStatus} from "./player/PlixPlayerState";

export type ClientPacket =
    | ClientBeginSendFilePacket
    | ClientRequestFilesPacket
    | ClientSelectPlixPacket
    | ClientRequestPlayerStatePacket
    | ClientChangePlayStatusPacket
    | ClientPlayerSeekPacket
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

export type ClientRequestPlayerStatePacket = ClientPacketWithId & {
    _type: "requestPlayerState",
}

export type ClientChangePlayStatusPacket = ClientPacketWithId & {
    _type: "changePlayStatus",
    status: "play" | "pause" | "stop",
}

export type ClientPlayerSeekPacket = ClientPacketWithId & {
    _type: "playerSeek",
    time: number, // ms
}