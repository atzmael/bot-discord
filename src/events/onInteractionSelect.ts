import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { SelectMenuInteraction } from "discord.js";

export const onInteractionSelect = async (interaction: SelectMenuInteraction, client: CustomClientProps) => {
    /* @ts-ignore */
    let commandName = interaction.message.interaction.commandName;
    const command = client.commands.get(commandName);
    try {
        await command.replyHandler[interaction.customId](interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}