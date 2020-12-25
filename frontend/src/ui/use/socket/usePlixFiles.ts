import {useWSClient} from "../useWSClient";
import {useCallback, useEffect, useState} from "react";
import {ServerAnswerRequestFilesPacket, ServerPacket} from "../../../../../typings/ServerPackets";
import {generateNewPacketId} from "../../../utils/packet-utils";
import {useGlobalState} from "../usaGlobalState";

let awaitingAnswerPacketIds = [];

type usePlixFilesReturn = [string[], () => void]

export const usePlixFiles = (): usePlixFilesReturn => {
    const wsClient = useWSClient();
    const [files, setFiles] = useGlobalState<string[]>("plixFiles",[]);


    const requestFiles = useCallback(() => {
        const id = generateNewPacketId();
        awaitingAnswerPacketIds.push(id);
        wsClient.send({
            _packetId: id,
            _type: "requestFiles",
        })
    }, [wsClient])

    useEffect(() => {
        const listener = (packet: ServerPacket) => {
            if (packet._type === "filesChanged") {
                setFiles(packet.files);
            } else if (packet._type === "answer") {
                if (!awaitingAnswerPacketIds.includes(packet._packetId)) return;
                const filesPacket = packet as ServerAnswerRequestFilesPacket;
                setFiles(filesPacket.files);
                console.log("RECEIVED FILES",filesPacket.files);
            }
        }

        wsClient.on("packet", listener)

        return () => {
            wsClient.off("packet", listener)
        }
    })

    return [files,requestFiles];
}