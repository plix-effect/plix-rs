import {IPlayerService, IMusicPlayerServiceEvents, IMusicPlayerServiceState} from "./IPlayerService";
import {TypedEventEmitter} from "../utils/TypedEventEmitter";
import MPlayer from "mplayer";


export class MPlayerService extends TypedEventEmitter<IMusicPlayerServiceEvents> implements IPlayerService {

    private player: MPlayer;
    private lastKnownTime: number = 0;
    private lastKnownVolume: number = 100;
    private lastKnownFile?: string;
    private lastKnownStatus?: IMusicPlayerServiceState["status"] = "stop";

    constructor() {
        super();
        this.player = new MPlayer();
    }

    async startFile(file: string) {
        const player = this.player;
        this.lastKnownStatus = "loading"
        this.lastKnownFile = file;
        return new Promise<void>((r) => {
            player.once("start", () => {r()});
            player.on("time", (time) => {
                this.lastKnownTime = time;
            })
            player.openFile(file);
        })
    };

    async play() {
        this.player.play();
        this.lastKnownStatus = "play";
    };
    async pause() {
        this.player.pause();
        this.lastKnownStatus = "pause";
    }
    async stop() {
        this.player.stop();
        this.lastKnownStatus = "stop";
    };
    async seek(time: number) {
        this.player.seek(time);
        this.lastKnownTime = time;
    };
    async setVolume(vol: number) {
        this.player.volume(vol);
    };

    getState(): IMusicPlayerServiceState {
        return {
            status: this.lastKnownStatus,
            file: this.lastKnownFile,
            time: this.lastKnownTime,
            volume: this.lastKnownVolume
        }
    }

}