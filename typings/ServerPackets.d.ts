import {PlayerStatus, PlixPlayerState} from "./player/PlixPlayerState";
import {
    ClientBeginSendFilePacket,
    ClientPacket,
    ClientRequestFilesPacket,
    ClientRequestPlayerStatePacket, ClientRequestSyncTimePacket
} from "./ClientPackets";

export type ServerPacket =
    | ServerAnswerRequestFilesPacket
    | ServerAnswerBeginSendFilePacket
    | ServerFilesChangedPacket
    | ServerPlayerStatePacket
    | ServerAnswerRequestPlayerStatePacket
    | ServerAnswerRequestSyncTimePacket
;


export type ServerAnswerPacket<CP extends ClientPacket> = {
    _type: "answer",
    _packetId: string,
    _clientPacketType: CP["_type"],
    _error?: string
}


export type ServerAnswerRequestFilesPacket = ServerAnswerPacket<ClientRequestFilesPacket> & {
    files: string[],
    _clientPacketType: "requestFiles"
}

export type ServerAnswerBeginSendFilePacket = ServerAnswerPacket<ClientBeginSendFilePacket> & {
    allow: boolean
    reason?: string
}
export type ServerAnswerRequestPlayerStatePacket = ServerAnswerPacket<ClientRequestPlayerStatePacket> & {
    state: PlixPlayerState
}

export type ServerFilesChangedPacket = {
    _type: "filesChanged"
    files: string[]
}

export type ServerPlayerStatePacket = {
    _type: "playerState",
    state: PlixPlayerState
}

export type ServerAnswerRequestSyncTimePacket = ServerAnswerPacket<ClientRequestSyncTimePacket> & {
    time: number
}