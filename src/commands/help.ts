import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const helpRun = (message: any, args: any, client: any, Discord: any) => {
    const cmds: Array<{ name: string, value: string }> = [];
    client.commands.forEach((item: any) => {
        cmds.push({
            name: `${client.globalVars.prefix}${item.name}`,
            value: item.desc
        })
    })
    const data = {
        title: "Liste des commandes disponibles",
        color: "#00bfb9",
        fields: cmds,
    }
    const embed = new Discord.MessageEmbed(data);
    const msg = {
        embeds: [embed]
    }
    return message.channel.send(msg);
}

module.exports = {
    active: true,
    family: "general",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Display help"),
    async execute(interaction: CommandInteraction) {
        await interaction.reply("Display help");
    }
}