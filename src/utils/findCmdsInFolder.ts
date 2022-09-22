import { readdirSync } from "fs";
import { readCmds } from "./readCmdFile";

export const loadCommands = async (dir: string, container: any, mode: "array" | "collection") => {
    return new Promise(async (res, rej) => {
        try {
            let files = await readdirSync(dir);
            for (let i = 0; i < files.length; i++) {
                await readCmds(files[i], dir, container, mode);
            }
            res(true);
        } catch (err) {
            console.log(err);
        }
    })
}