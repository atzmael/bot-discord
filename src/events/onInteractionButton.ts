import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { createErrorLog } from "@models/Logs";
import { ButtonInteraction } from "discord.js";

export const onInteractionButton = async (interaction: ButtonInteraction, client: CustomClientProps) => {
    /* @ts-ignore */
    let commandName = interaction.message.interaction.commandName.split(" ")[0];
    const command = client.commands.get(commandName);
    try {
        if (!!command.replyHandler[interaction.customId]) {
            await command.replyHandler[interaction.customId](interaction);
        } else {
            createErrorLog({ type: "onInteractionButton", error: `replyHandler is not a function (cmd:${commandName},interact:${interaction.customId})` })
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}