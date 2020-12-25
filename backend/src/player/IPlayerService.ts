import {ITypedEventEmitter} from "../utils/TypedEventEmitter";

export type IMusicPlayerServiceState = {
    time?: number,
    file?: string,
    status?: "play" | "pause" | "stop" | "loading" | null
    volume?: number
}

export type IMusicPlayerServiceEvents = {
    time: (time: number) => void
    start: () => void
    play: () => void
    pause: () => void
    stop: () => void
    status: (status: any) => void
}

export interface IPlayerService extends ITypedEventEmitter<IMusicPlayerServiceEvents> {

    startFile(file: string): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    stop(): Promise<void>;
    seek(time: number): Promise<void>;
    setVolume(vol: number): Promise<void>;
    getState(): IMusicPlayerServiceState
}