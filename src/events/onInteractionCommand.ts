import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { CommandInteraction } from "discord.js";

export const onInteractionCommand = async (interaction: CommandInteraction, client: CustomClientProps) => {
    const { commandName } = interaction;
    const command = client.commands.get(commandName);
    try {
        await command.execute(interaction, client);

        /* setTimeout(() => {
            if(interaction.replied) {
                console.log(interaction);
            }
        }, 3000); */
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}