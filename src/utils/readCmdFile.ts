import { statSync } from "fs";
import { resolve } from "path";
import { loadCommands } from "./findCmdsInFolder";

export const readCmds = (fileName: any, dir: string, container: any, mode: "array" | "collection") => {
    return new Promise(async (res, rej) => {
        let file = resolve(dir, fileName);

        try {
            const stat = await statSync(file);
            if (!!stat && stat.isDirectory()) {
                await loadCommands(file, container, mode);
                res(true);
            } else {
                const cmd = require(file);
                if (!!cmd && !!cmd.active) {
                    if ("array" === mode) {
                        container.push(cmd.data);
                    } else if ("collection" === mode) {
                        container.set(cmd.data.name, cmd);
                    }
                }
                res(true);
            }
        } catch (err) {
            console.log(err);
        }
    })
}