import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { SelectMenuInteraction } from "discord.js";

export const onInteractionSelect = async (interaction: SelectMenuInteraction, client: CustomClientProps) => {
    let commandName = "";
    let functionId = "";
    if (!!interaction.message.interaction) {
        /* @ts-ignore */
        commandName = interaction.message.interaction.commandName.split(" ")[0];
        functionId = interaction.customId;
    } else {
        let customIdArray = interaction.customId.split(',');
        commandName = customIdArray[0];
        functionId = customIdArray[1];
    }
    const command = client.commands.get(commandName);
    try {
        await command.replyHandler[functionId](interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}