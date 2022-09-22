import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { Interaction } from "discord.js";
import { onInteractionAutocomplete } from "./onInteractionAutocomplete";
import { onInteractionButton } from "./onInteractionButton";
import { onInteractionCommand } from "./onInteractionCommand";
import { onInteractionModal } from "./onInteractionModal";
import { onInteractionSelect } from "./onInteractionSelect";

export const onInteraction = async (interaction: Interaction, client: CustomClientProps) => {
    if (!interaction) return;
    if (!client.botLoaded) return; // Block si le bot n'est pas encore chargé
    if (!!interaction.user.bot) return; // Block si c'est un bot qui fait une commande

    // Slash Command
    if (!!interaction.isCommand()) {
        onInteractionCommand(interaction, client);
    }

    // User interactions
    if (!!interaction.isButton()) {
        onInteractionButton(interaction, client);
    }
    if (!!interaction.isSelectMenu()) {
        onInteractionSelect(interaction, client);
    }
    if (!!interaction.isModalSubmit()) {
        onInteractionModal(interaction, client);
    }
    if (!!interaction.isAutocomplete()) {
        onInteractionAutocomplete(interaction, client);
    }

    return;
}