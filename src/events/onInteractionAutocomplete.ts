import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { Interaction } from "discord.js";

export const onInteractionAutocomplete = async (interaction: Interaction, client: CustomClientProps) => {
    /* @ts-ignore */
    console.log("Interaction AUTOCOMPLETE", interaction.options);
}