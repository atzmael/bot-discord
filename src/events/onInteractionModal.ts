import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { ModalSubmitInteraction } from "discord.js";

export const onInteractionModal = async (interaction: ModalSubmitInteraction, client: CustomClientProps) => {
    let commandName = client.pendingModals.get(interaction.customId);
    const command = client.commands.get(commandName);
    try {
        await command.replyHandler[interaction.customId](interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}