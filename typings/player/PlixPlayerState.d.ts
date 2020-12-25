import {Track} from "./Track";
import {Playlist} from "./Playlist";

type PlayingTrack = {
    type: "track",
    track: Track
}

type PlayingPlaylist = {
    type: "playlist",
    playlist: Playlist,
    track?: Track,
}

export type PlayingObject = PlayingTrack | PlayingPlaylist

export type PlayerStatus = "play" | "pause" | "stop" | "loading" | null;

export type PlixPlayerState = {
    currentTime?: number
    duration?: number
    volume?: number
    status?: PlayerStatus
    playingObject?: PlayingObject
}