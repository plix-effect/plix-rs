import {useWSClient} from "../useWSClient";
import {useCallback, useEffect, useState} from "react";
import {generateNewPacketId} from "../../../utils/packet-utils";
import {useGlobalState} from "../usaGlobalState";
import {EventPacket} from "../../../../../typings/Packets";


type usePlixFilesReturn = [string[], () => void]

export const usePlixFiles = (): usePlixFilesReturn => {
    const wsClient = useWSClient();
    const [files, setFiles] = useGlobalState<string[]>("plixFiles",[]);


    const requestFiles = useCallback(async () => {
        const id = generateNewPacketId();
        const res = await wsClient.sendRequestPacket("requestFiles", {});
        setFiles(res.files);
    }, [wsClient])

    useEffect(() => {
        requestFiles();
        const listener = (packet : EventPacket) => {
            if (packet._type === "filesChanged") {
                setFiles(packet.files);
            }
        }

        wsClient.on("packet", listener)

        return () => {
            wsClient.off("packet", listener)
        }
    }, [])

    return [files,requestFiles];
}