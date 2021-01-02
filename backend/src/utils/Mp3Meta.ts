import MP3Tag from "mp3tag.js";
import {inflate, deflate} from "pako";

const OWNER_ID = "plix-effect";


export function readMp3Json(buffer: Buffer): object|null {
    const mp3tag = new MP3Tag(buffer, false);
    mp3tag.read();
    const priv: undefined|{ownerId:string, data: number[]}[] = mp3tag.tags.v2.PRIV;
    if (!priv) return null;
    const plixTag = priv.find(tag => tag.ownerId === OWNER_ID);
    if (!plixTag) return null;
    try {
        const text = inflate(plixTag.data, { to: 'string' });
        return JSON.parse(text);
    } catch {}
    return null;
}

export function readMp3CoverImage(buffer: ArrayBuffer): Buffer|null {
    const mp3tag = new MP3Tag(buffer, false);
    mp3tag.read();
    const apic = mp3tag.tags?.v2?.APIC;
    if (!apic || apic.length == 0) return null;
    const coverData = apic[0].data;
    return new Buffer(coverData);
}
