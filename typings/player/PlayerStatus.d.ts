import {Track} from "./Track";
import {Playlist} from "./Playlist";

type PlayingTrack = {
    type: "track",
    track: Track
    duration: number
}

type PlayingPlaylist = {
    type: "playlist",
    playlist: Playlist,
    currentTrack?: Track,
    currentTrackDuration?: number
}

export type PlayingObject = PlayingTrack | PlayingPlaylist

export type PlayerStatus = {
    time: number
    volume: number
    playingObject: PlayingObject
}