import {PlayerStatus} from "./player/PlayerState";

export type ServerPacket =
    | ServerAnswerRequestFilesPacket
    | ServerAnswerBeginSendFilePacket
    | ServerFilesChangedPacket
    ;


export type ServerAnswerPacket = {
    _type: "answer",
    _packetId: string,
    _error?: string
}


export type ServerAnswerRequestFilesPacket = ServerAnswerPacket & {
    files: string[]
}

export type ServerAnswerBeginSendFilePacket = ServerAnswerPacket & {
    allow: boolean
    reason?: string
}

export type ServerFilesChangedPacket = {
    _type: "filesChanged"
    files: string[]
}

export type ServerPlayerStatusPacket = {
    _type: "playerStatus",
    status: PlayerStatus
}