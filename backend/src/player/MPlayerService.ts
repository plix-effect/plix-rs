import {IMusicPlayerService, IMusicPlayerServiceEvents, IMusicPlayerServiceState} from "./IMusicPlayerService";
import {TypedEventEmitter} from "../utils/TypedEventEmitter";
import MPlayer from "mplayer";


export class MPlayerService extends TypedEventEmitter<IMusicPlayerServiceEvents> implements IMusicPlayerService {

    private player: MPlayer;

    constructor() {
        super();
        this.player = new MPlayer();
    }

    async startFile(file: string) {
        const player = this.player;
        return new Promise<void>((r) => {
            player.once("start", () => {r()});
            player.openFile(file);
        })
    };

    async play() {

    };
    async pause() {
    }
    async resume() {};
    async seek(time: number) {};
    async setVolume(vol: number) {};

    getState() {
        return null as any;
    }

}