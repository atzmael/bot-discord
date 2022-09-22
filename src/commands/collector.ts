import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandTypes } from "@interfaces/commandTypes";
import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { CommandInteraction } from "discord.js";

const commandProps = {
    name: "collector",
    description: "collect msg"
}

const execute = async (interaction: CommandInteraction, client: CustomClientProps) => {
    //https://www.youtube.com/watch?v=AAG5_QVvgZY&list=PLaxxQQak6D_f4Z5DtQo0b1McgjLVHmE8Q&index=10
}

const Modal: CommandTypes = {
    active: true,
    family: "playground",
    data: new SlashCommandBuilder()
        .setName(commandProps.name)
        .setDescription(commandProps.description),
    execute
}

module.exports = Modal;