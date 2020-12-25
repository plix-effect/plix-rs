import fs from "fs";
import util from "util";

const readdir = util.promisify(fs.readdir);
const checkExists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

export const createPlixFileManager = (baseDir: string) => {

    checkExists(baseDir).then((v) => {
        if (!v) mkdir(baseDir);
    })

    const getFileList = async () => {
        return readdir(baseDir);
    }

    return {
        getFileList
    }
}