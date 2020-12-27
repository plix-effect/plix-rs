import {useGlobalState} from "../usaGlobalState";
import {useEffect} from "react";
import {useWSClient} from "../useWSClient";

export const useServerTimeOffset = (): [number, () => void] => {
    const ws = useWSClient();
    const [offset, setOffset] = useGlobalState("server-time-offset", 0);

    const resyncTime = async () => {
        const perfBefore = performance.now();
        const sPacket = await ws.sendRequestPacket("syncTime", {})
        const perfAfterAnswer = performance.now();
        const perfDif = perfAfterAnswer-perfBefore;
        const dif = performance.now()*1000 - sPacket.time - perfDif;
        setOffset(dif);
    }

    useEffect(() => {
        resyncTime()
    }, [])

    return [offset, resyncTime]
}