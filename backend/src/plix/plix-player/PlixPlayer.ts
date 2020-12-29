import {PlixPlayerState} from "../../../../typings/player/PlixPlayerState";
import {AbstractAdafruitService} from "../adafruit/AbstractAdafruitService";
import parseRender from "@plix-effect/core/dist/parser";
import * as effectConstructorMap from "@plix-effect/core/effects";
import * as filterConstructorMap from "@plix-effect/core/filters";
import {createPlixFileManager} from "../../PlixFileManager";
import {TypedEventEmitter} from "../../utils/TypedEventEmitter";
import {BLACK, toNumber} from "@plix-effect/core/color";
import {Simulate} from "react-dom/test-utils";
import {IMusicPlayerService} from "../../music/IMusicPlayerService";

export type PlixPlayerEvents = {
    state: (state: PlixPlayerState) => void;
}

const RENDER_INTERVAL_MS = 20; //ms

export class PlixPlayer extends TypedEventEmitter<PlixPlayerEvents> {

    private musicPlayer: IMusicPlayerService;
    private adafruitService: AbstractAdafruitService;
    private plixFileManager: ReturnType<typeof createPlixFileManager>;
    private state: PlixPlayerState = {};
    private loadedRender?: object;
    private parsedRenderResult?: ReturnType<typeof parseRender>;
    private playFromTimestamp: number = 0; // in ms
    private pauseTime: number = 0; // in ms

    constructor(plixFileManager: ReturnType<typeof createPlixFileManager>, adafruitService: AbstractAdafruitService, musicPlayer: IMusicPlayerService) {
        super();
        this.plixFileManager = plixFileManager;
        this.adafruitService = adafruitService;
        this.musicPlayer = musicPlayer;
    }

    public getState(): PlixPlayerState {
        return {...this.state};
    }

    public async selectTrack(file: string) {
        // ToDo parse
        this.state = {
            volume: this.musicPlayer.getState().volume,
        }
        this.state.status = "loading"
        this.emit("state", this.state);
        await this.parsePlixFile(file);
        if (this.parsedRenderResult == null) {
            this.state.status = null;
            return this.state;
        }
        this.musicPlayer.stop();
        this.state = {
            status: "stop",
            volume: this.musicPlayer.getState().volume,
            playingObject: {
                type: "track",
                track: {
                    file: file,
                    name: file
                }
            },
            playFromTime: undefined,
            duration: this.currentDuration
        }
        this.emit("state", this.state);
        return this.state;
    }

    public async setVolume(vol: number) {
        return this.musicPlayer.setVolume(vol)
    }

    public async start() {
        if ((["play", "loading", null] as any[]).includes(this.state.status)) return
        if (!this.parsedRenderResult) return;
        const playinObj = this.state.playingObject;
        if (playinObj?.type !== "track") return;
        const fileName = playinObj.track.file;
        const fullFilePath = this.plixFileManager.getFullFilePath(fileName);
        if (this.isCurrentFileMP3) {
            if (this.musicPlayer.getState().file !== fullFilePath) {
                await this.musicPlayer.startFile(fullFilePath);
            }
        }
        if (this.isCurrentFileMP3) {
            this.musicPlayer.play();
        }
        this.playFromTimestamp = process.uptime()*1000 - this.pauseTime;
        this.pauseTime = 0;
        this.state = {...this.state, status: "play", playFromTime: this.playFromTimestamp, pauseTime: undefined};
        this.emit("state", this.state);
        this.doTick();
    }

    public async pause() {
        if (this.state.status !== "play") return;
        this.pauseTime = this.currentTime;
        this.state = {...this.state, status: "pause", pauseTime: this.pauseTime};
        if (this.isCurrentFileMP3) {
            this.musicPlayer.pause();
        }
        this.emit("state", this.state);
    }

    public async stop() {
        this.state = {...this.state, status: "stop", pauseTime: undefined, playFromTime: undefined};
        this.pauseTime = 0;
        if (this.isCurrentFileMP3) {
            this.musicPlayer.stop();
        }
        this.emit("state", this.state);
    }

    public async seek(timeMs: number) {
        if (this.state.status === "play") {
            this.playFromTimestamp -= timeMs;
            this.state = {...this.state, playFromTime: this.playFromTimestamp};
        } else {
            this.pauseTime = timeMs;
            this.state = {...this.state, playFromTime: this.playFromTimestamp, pauseTime: this.pauseTime, status: "pause"};
        }
        if (this.isCurrentFileMP3) {
            this.musicPlayer.seek(timeMs/1000);
        }
        this.emit("state", this.state);
    }

    private tickProcessId?: ReturnType<typeof setTimeout>;
    private doTick = () => {
        if (this.state.status != "play") return;
        const dif = process.uptime()*1000 - this.playFromTimestamp;
        if (dif >= this.currentDuration) {
            // TODo if playlist - go next;
            this.stop();
            return;
        }
        this.tickProcessId = setTimeout(this.doTick, RENDER_INTERVAL_MS);
        this.render();
    }

    private render() {
        const dif = this.currentTime;
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

    private get currentTime(): number {
        return process.uptime()*1000 - this.playFromTimestamp;
    }
}