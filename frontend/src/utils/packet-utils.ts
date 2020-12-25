let freePacketId = 0;

export const generateNewPacketId = (): string => {
    return String(freePacketId++)
}