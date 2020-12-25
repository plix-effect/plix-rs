import {Track} from "./Track";

export type Playlist = {
    name: string,
    file?: string
    items: Track[]
}