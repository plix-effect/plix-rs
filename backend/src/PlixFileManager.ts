import fs from "fs";
import util from "util";
import * as path from "path";
import {readMp3Json} from "./utils/Mp3Meta";

const readdir = util.promisify(fs.readdir);
const checkExists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);

export const createPlixFileManager = (baseDir: string = path.join(__dirname, "/../", "plix")) => {

    checkExists(baseDir).then((v) => {
        if (!v) mkdir(baseDir);
    })

    const getFileList = async () => {
        return readdir(baseDir);
    }

    const readFileData = async (file: string): Promise<ArrayBuffer> => {
        const path = getFullFilePath(file);
        return readFile(path);
    }

    const readJsonFromFile = async (file: string): Promise<object|null> => {
        const data = await readFileData(file);
        if (file.endsWith(".mp3")) {
            return readMp3Json(data);
        } else if (file.endsWith(".json")) {
            const str = String.fromCharCode.apply(null, new Uint16Array(data));
            return JSON.parse(str);
        } else {
            return null;
        }
    }

    const getFullFilePath = (fileName: string) => {
        return path.join(baseDir, fileName);
    }

    return {
        getFileList,
        readJsonFromFile,
        getFullFilePath
    }
}

export type PlixFileManager = ReturnType<typeof createPlixFileManager>