import {useWSClient} from "../useWSClient";
import {useEffect, useState} from "react";
import {ServerPacket} from "../../../../../typings/ServerPackets";


export const usePlixFiles = () => {
    const wsClient = useWSClient();
    const [files, setFiles] = useState<string[]>([])

    useEffect(() => {
        const listener = (packet: ServerPacket) => {
            if (packet._type !== "filesChanged") return;
            setFiles(packet.files);
        }

        wsClient.on("packet", listener)

        return () => {
            wsClient.off("packet", listener)
        }
    })

    return files;
}