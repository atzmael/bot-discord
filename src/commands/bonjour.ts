import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    active: true,
    family: "misc",
    data: new SlashCommandBuilder()
        .setName('bjr')
        .setDescription("Réponds avec Bonjour !"),
    async execute(interaction: CommandInteraction) {
        await interaction.reply("Bonjour !");
    }
}