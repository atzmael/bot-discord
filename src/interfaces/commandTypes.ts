import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CustomClientProps } from "./extendDiscordJS";

type CommandFamilies = "general" | "misc" | "playground";

export interface CommandTypes {
    active: boolean;
    family: CommandFamilies;
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction, client: CustomClientProps) => Promise<void>;
    replyHandler?: {
        [keys: string]: (interaction: any) => Promise<void>; // SelectInteractionMenu | 
    };
    adminOnly?: boolean;
}