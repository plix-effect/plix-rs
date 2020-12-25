import {MPlayerService} from "../../music/MPlayerService";
import {PlixPlayerState} from "../../../../typings/player/PlixPlayerState";
import {AbstractAdafruitService} from "../adafruit/AbstractAdafruitService";
import {AdafruitService} from "../adafruit"
import parseRender from "@plix-effect/core/dist/parser";
import * as effectConstructorMap from "@plix-effect/core/effects";
import * as filterConstructorMap from "@plix-effect/core/filters";
import {createPlixFileManager} from "../../PlixFileManager";
import {TypedEventEmitter} from "../../utils/TypedEventEmitter";
import {BLACK, toNumber, toRgba} from "@plix-effect/core/color";
import {Simulate} from "react-dom/test-utils";
import loadedData = Simulate.loadedData;

export type PlixPlayerEvents = {
    state: (state: PlixPlayerState) => void;
}

const RENDER_INTERVAL_MS = 20; //ms

export class PlixPlayer extends TypedEventEmitter<PlixPlayerEvents> {

    private mPlayer: MPlayerService = new MPlayerService();
    private adafruitService: AbstractAdafruitService;
    private plixFileManager: ReturnType<typeof createPlixFileManager>;
    private state: PlixPlayerState = {};
    private loadedRender?: object;
    private parsedRenderResult?: ReturnType<typeof parseRender>;
    private playingFromTimestamp: number = 0; // in ms
    private pauseTime: number = 0; // in ms
    constructor(plixFileManager: ReturnType<typeof createPlixFileManager>, adafruitService: AbstractAdafruitService) {
        super();
        this.plixFileManager = plixFileManager;
        this.adafruitService = adafruitService;
    }

    public async selectTrack(file: string) {
        // ToDo parse
        this.state = {
            volume: this.mPlayer.getState().volume,
        }
        this.state.status = "loading"
        this.emit("state", this.state);
        await this.parsePlixFile(file);
        if (this.parsedRenderResult == null) {
            this.state.status = null;
            return this.state;
        }
        this.state = {
            status: "stop",
            volume: this.mPlayer.getState().volume,
            playingObject: {
                type: "track",
                track: {
                    file: file,
                    name: file
                }
            },
            currentTime: 0,
            duration: this.currentDuration
        }
        this.emit("state", this.state);
        return this.state;
    }

    public async setVolume(vol: number) {
        return this.mPlayer.setVolume(vol)
    }

    public async start() {
        if (!this.parsedRenderResult) return;
        const playinObj = this.state.playingObject;
        if (playinObj?.type !== "track") return;
        const fileName = playinObj.track.file;
        if (this.isCurrentFileMP3) {
            if (this.mPlayer.getState().file !== fileName) {
                console.log("BLA")
                await this.mPlayer.startFile(this.plixFileManager.getFullFilePath(fileName));
            }
        }
        this.playingFromTimestamp = process.uptime()*1000 - this.pauseTime;
        if (this.isCurrentFileMP3) {
            this.mPlayer.seek(this.playingFromTimestamp/1000)
        }
        this.state = {...this.state, status: "play", currentTime: this.pauseTime};
        this.emit("state", this.state);
        this.doTick();
    }

    public async pause() {
        if (this.state !== "play") return;
        this.pauseTime = process.uptime()*1000 - this.playingFromTimestamp;
        this.state = {...this.state, status: "pause", currentTime: this.pauseTime};
        this.emit("state", this.state);
    }

    public async stop() {
        this.state = {...this.state, status: "stop"};
        if (this.isCurrentFileMP3) {
            this.mPlayer.stop();
        }
        this.emit("state", this.state);
    }

    public async seek(timeMs: number) {
        if (this.state.status === "play") {
            this.playingFromTimestamp -= timeMs;
            this.state = {...this.state, currentTime: timeMs};
        } else {
            this.pauseTime = timeMs;
            this.state = {...this.state, currentTime: timeMs, status: "pause"};
        }
        if (this.isCurrentFileMP3) {
            this.mPlayer.seek(timeMs/1000);
        }
        this.emit("state", this.state);
    }

    private tickProcessId?: ReturnType<typeof setTimeout>;
    private doTick = () => {
        if (this.state.status != "play") return;
        const dif = process.uptime()*1000 - this.playingFromTimestamp;
        if (dif >= this.currentDuration) {
            // TODo if playlist - go next;
            this.stop();
            return;
        }
        this.tickProcessId = setTimeout(this.doTick, RENDER_INTERVAL_MS);
        this.render();
    }

    private render() {
        const dif = process.uptime()*1000 - this.playingFromTimestamp;
        const effect = this.parsedRenderResult?.effect;
        if (!effect) return;
        const lineMod = effect(dif, this.currentDuration, 0);
        const pixelCount = this.adafruitService.getPixelCount();
        const uArr = new Uint32Array(pixelCount);
        for (let i = 0; i < pixelCount; i++) {
            const colorMod = lineMod(i, pixelCount);
            const color = colorMod(BLACK);
            uArr[i] = toNumber(color);
        }
        console.log(dif, JSON.stringify(uArr), this.currentDuration);
        this.adafruitService.write(uArr);
    }

    private async parsePlixFile(file: string, profileName?: string) {
        const data = await this.plixFileManager.readJsonFromFile(file);
        if (data === null) return null;
        this.loadedRender = data;
        this.parsedRenderResult = parseRender(data["render"], data["effects"], data["filters"], effectConstructorMap, filterConstructorMap, data["profiles"], profileName);
    }

    private get isCurrentFileMP3() {
        const playinObj = this.state.playingObject;
        if (playinObj?.type !== "track") return false;
        const fileName = playinObj.track.file;
        return fileName.endsWith(".mp3");
    }

    private get currentDuration(): number {
        return this.loadedRender ? this.loadedRender["editor"]["duration"] : -1;
    }
}