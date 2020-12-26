import {IMusicPlayerService, IMusicPlayerServiceEvents, IMusicPlayerServiceState} from "./IMusicPlayerService";
import {TypedEventEmitter} from "../utils/TypedEventEmitter";
import MPlayer from "mplayer";


export class MPlayerService extends TypedEventEmitter<IMusicPlayerServiceEvents> implements IMusicPlayerService {

    private player: MPlayer;
    private lastKnownTime: number = 0;
    private lastKnownVolume: number = 100;
    private lastKnownFile?: string;
    private lastKnownStatus?: IMusicPlayerServiceState["status"] = "stop";
    private muted: boolean = false;

    constructor() {
        super();
        this.player = new MPlayer();
    }

    async startFile(file: string) {
        const player = this.player;
        console.log("STARTING", file);
        const mp3PathForMPlayer = file.replace(/\\/g, "/")
        this.lastKnownStatus = "loading"
        this.lastKnownFile = file;
        this.emit("state", this.getState());
        return new Promise<void>((r) => {
            player.once("start", () => {
                r();
                this.emitState();
            });
            player.on("time", (time) => {
                this.lastKnownTime = time;
                this.emit("time", time);
            })
            player.openFile(mp3PathForMPlayer, {volume: 0});
        })
    };

    async play() {
        this.player.play();
        this.lastKnownStatus = "play";
        return new Promise<void>((r) => {
            this.player.once("status", () => {
                r();
                this.emitState();
            })
        })
    };
    async pause() {
        this.player.pause();
        this.lastKnownStatus = "pause";
        return new Promise<void>((r) => {
            this.player.once("status", () => {
                r();
                this.emitState();
            })
        })
    }
    async stop() {
        this.player.stop();
        this.lastKnownStatus = "stop";
        return new Promise<void>((r) => {
            this.player.once("status", () => {
                r();
                this.emitState();
            })
        })
    };
    async seek(time: number) {
        this.player.seek(time);
        return new Promise<void>((r) => {
            this.player.once("time", (t) => {
                this.lastKnownTime = time;
                r();
                this.emitState();
            })
        })
    };
    async setVolume(vol: number) {
        this.player.volume(vol);
        if (vol === 0 && !this.muted) {
            this.player.mute();
            this.muted = true;
        } else if (vol !== 0 && this.muted) {
            this.player.mute();
            this.muted = false;
        }
        this.emitState();
    };

    getState(): IMusicPlayerServiceState {
        return {
            status: this.lastKnownStatus,
            file: this.lastKnownFile,
            time: this.lastKnownTime,
            volume: this.lastKnownVolume
        }
    }

    private emitState() {
        this.emit("state", this.getState());
    }

}