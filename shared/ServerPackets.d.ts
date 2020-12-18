
export interface ServerNotifyPacket {
    type: string
}

export interface ServerAnswerPacket {
    _packetId: string,
    error?: string
}

export interface ServerAnswerRequestFilesPacket extends ServerAnswerPacket {
    files: string[]
}

export interface ServerAnswerBeginSendFilePacket extends ServerAnswerPacket {
    allow: boolean
    reason?: string
}