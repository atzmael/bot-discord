import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { loadCommands } from "@utils/findCmdsInFolder";
import { join } from "path";
import mongoose from 'mongoose';
import 'dotenv/config';

export const onReady = async (client: CustomClientProps) => {
    client.botLoaded = false;

    await mongoose.connect(
        process.env.MONGO_URI || '',
        {
            keepAlive: true,
            dbName: "community"
        }
    )

    const dir = join(__dirname, '../commands');
    await loadCommands(dir, client.commands, "collection");
    console.log("The bot is ready to rock!");
    client.botLoaded = true;
    //TODO: display all available commands in the console
}