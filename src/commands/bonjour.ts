import { SlashCommandBuilder } from "@discordjs/builders";
import { sortFamilies } from "@models/Family";
import { CommandInteraction } from "discord.js";

module.exports = {
    active: false,
    family: "misc",
    data: new SlashCommandBuilder()
        .setName('bjr')
        .setDescription("Réponds avec Bonjour !"),
    async execute(interaction: CommandInteraction) {
        await interaction.reply("Bonjour !");
    }
}