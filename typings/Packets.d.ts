import {PlayerStatus, PlixPlayerState} from "./player/PlixPlayerState";

export type RequestPacketMap = {
    syncTime: {
        request: {}
        response: {
            time: number
        }
    },
    beginSendFile: {
        request: {
            file: string,
            size: number
        },
        response: {
            allow: boolean,
            reason?: string
        }
    },
    requestFiles: {
        request: {},
        response: {
            files: string[]
        }
    },
    playerSeek: {
        request: {
            time: number
        },
        response: null
    }
    changePlayStatus: {
        request: {
            status: "play" | "pause" | "stop"
        }
        response: null
    },
    requestPlayerState: {
        request: {},
        response: {
            state: PlixPlayerState
        }
    },
    selectPlix: {
        request: {
            file: string
        }
        response: null
    },
    uploadFile: {
        request: {
            fileName: string,
            file: ArrayBuffer | Buffer
        },
        response: {
            success: boolean,
            reason?: string
        }
    },
    removeFile: {
        request: {
            fileName: string
        },
        response: {
            success: boolean,
            reason?: string
        }
    }
}

export type ClientPacketMap = {
    [T in keyof RequestPacketMap]: {
        _packetId: string,
        _type: T
    } & RequestPacketMap[T]["request"]
}

export type ClientPacket<T extends keyof ClientPacketMap = keyof ClientPacketMap> = ClientPacketMap[T]


export type ServerAnswerPacketMap = {
    [T in keyof RequestPacketMap]: RequestPacketMap[T]["response"] extends null ? null : ({
        _packetId: string,
        _type: "answer",
        _clientPacketType: T
        _error?: string
    } & RequestPacketMap[T]["response"])
}

export type ServerAnswerPacket<T extends keyof ServerAnswerPacketMap = keyof ServerAnswerPacketMap> = ServerAnswerPacketMap[T]

export type PacketAnswer<CP extends ClientPacket> = CP extends ClientPacket<infer T> ? ServerAnswerPacket<T> : never


export type EventPacketMap = {
    filesChanged: {
        files: string[]
    },
    playerState: {
        state: PlixPlayerState
    },
    errorOccurred: {
        error: string
    }
}

export type EPM = {
    [T in keyof EventPacketMap]: {
        _type: T
    } & EventPacketMap[T]
}

export type EventPacket<T extends keyof EventPacketMap = keyof EventPacketMap> = EPM[T]