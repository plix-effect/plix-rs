import {ITypedEventEmitter} from "../utils/TypedEventEmitter";

export type IMusicPlayerServiceState = {
    time?: number,
    file?: number,
    status?: "play" | "pause" | "stop" | null
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

export interface IMusicPlayerService extends ITypedEventEmitter<IMusicPlayerServiceEvents> {

    startFile(file: string): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seek(time: number): Promise<void>;
    setVolume(vol: number): Promise<void>;
    getState(): IMusicPlayerServiceState
}