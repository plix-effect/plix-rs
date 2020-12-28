import {useWSClient} from "../useWSClient";
import {PlixPlayerState} from "../../../../../typings/player/PlixPlayerState";
import {useEffect, useState} from "react";
import {useGlobalState} from "../usaGlobalState";

interface UseServerPlixPlayerResult {
    state: PlixPlayerState,
    play: () => void,
    pause: () => void,
    stop: () => void,
    selectPlix: (file: string) => void,
    setVolume: (vol: number) => void,
}

export const useServerPlixPlayer = (): UseServerPlixPlayerResult => {
    const ws = useWSClient();

    const [plixPlayerState, setPlixPlayerState] = useGlobalState("plix-player-state",{});

    const refreshPlayerState = async () => {
        const packet = await ws.sendRequestPacket("requestPlayerState", {})
        setPlixPlayerState(packet.state);
    }

    const changePlayStatus = (status: "play" | "pause" | "stop") => {
        ws.send("changePlayStatus", {status})
    }

    const selectPlix = (file: string) => {
        ws.send("selectPlix", {file})
    }

    useEffect(() => {
        refreshPlayerState();

        ws.on("packet", (packet) => {
            if (packet._type != "playerState") return;
            setPlixPlayerState(packet.state);
        })
    }, [])

    return {
        state: plixPlayerState,
        play: changePlayStatus.bind(null, "play"),
        pause: changePlayStatus.bind(null, "pause"),
        stop: changePlayStatus.bind(null, "stop"),
        selectPlix,
        setVolume: (i: number) => {}
    }
}

export const useServerPlixPlayerControl = (): Omit<UseServerPlixPlayerResult, "state"> => {
    const ws = useWSClient();

    const changePlayStatus = (status: "play" | "pause" | "stop") => {
        ws.send("changePlayStatus", {status})
    }

    const selectPlix = (file: string) => {
        ws.send("selectPlix", {file})
    }

    return {
        play: changePlayStatus.bind(null, "play"),
        pause: changePlayStatus.bind(null, "pause"),
        stop: changePlayStatus.bind(null, "stop"),
        selectPlix,
        setVolume: (i: number) => {}
    }
}