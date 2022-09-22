import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { join } from 'path';
import { loadCommands } from "@utils/findCmdsInFolder";
import 'dotenv/config';

const init = async () => {
    const commands: Array<any> = [];

    const dir = join(__dirname, './src/commands');

    console.log("Deploying commands...");
    await loadCommands(dir, commands, "array");

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN || '');

    rest.put(
        // Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''),
        Routes.applicationCommands(process.env.CLIENT_ID || ''),
        { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);

    // DELETE ALL LOCAL COMMAND
    /* rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''), { body: [] })
        .then(() => console.log('Successfully deleted all guild commands.'))
        .catch(console.error); */
}

init();