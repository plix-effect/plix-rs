import {ITypedEventEmitter} from "../utils/TypedEventEmitter";

export type IMusicPlayerServiceState = {
    time?: number,
    file?: string,
    status?: "play" | "pause" | "stop" | "loading" | null
    volume?: number
}

export type IMusicPlayerServiceEvents = {
    time: (time: number) => void
    state: (state: IMusicPlayerServiceState) => void
}

export interface IMusicPlayerService extends ITypedEventEmitter<IMusicPlayerServiceEvents> {

    startFile(file: string): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    stop(): Promise<void>;
    seek(time: number): Promise<void>;
    setVolume(vol: number): Promise<void>;
    getState(): IMusicPlayerServiceState
}