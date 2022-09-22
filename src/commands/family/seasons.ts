import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CreateModal } from "@interactions/CreateModal";
import { CreateTextInput } from "@interactions/CreateTextInput";
import { CustomClientProps, CustomModalOptions } from "@interfaces/extendDiscordJS";
import { addSeason, findAllSeasons, SeasonProps, SeasonStatus, SeasonStatusLabel } from "@models/Family";
import { getDayBetweenTwoDates, getFullDate } from "@utils/DateUtils";
import { sanitizeString, slugifyString } from "@utils/valueParsingUtils";
import { CommandInteraction, ModalSubmitInteraction, TextInputComponentOptions } from "discord.js";

const cmdProps = {
    name: "hexa-season",
}

const handleSeasonsCmd = async (interaction: CommandInteraction, client: CustomClientProps) => {
    // Display list of commandes for seasons

    if (!interaction.options) return;
    let iReply: any = "Aucune interaction detectée...";

    const subcmd = interaction.options.getSubcommand();

    // PUBLIC COMMANDS
    if ("infos" === subcmd) {
        let currSeason = await findAllSeasons({ status: SeasonStatus.GOING });
        let preparingSeason = await findAllSeasons({ status: SeasonStatus.PREPARING });
        if (currSeason.length > 0 || preparingSeason.length > 0) {
            const s = currSeason[0] || preparingSeason[0];
            const sd = new Date(s.start_date!);
            const ed = new Date(s.end_date!);
            const today = new Date(Date.now());
            today.setMonth(today.getMonth() + 1);

            const embed = {
                title: s.name!,
                fields: [
                    { name: "Status", value: SeasonStatusLabel[s.status!], inline: false },
                    { name: "_ _", value: "_ _", inline: false },
                    { name: "Durée (en jours)", value: s.duration!.toString(), inline: true },
                    { name: "Temps restants (en jours)", value: getDayBetweenTwoDates(today, ed).toString(), inline: true },
                    { name: "_ _", value: "_ _", inline: false },
                    { name: "Début", value: `${sd.getDate()}/${sd.getMonth()}/${sd.getFullYear()}`, inline: true },
                    { name: "Fin", value: `${ed.getDate()}/${ed.getMonth()}/${ed.getFullYear()}`, inline: true },
                ]
            };
            iReply = { content: "_ _", embeds: [embed] };
        } else {
            iReply = "Il n'y a pas de saison en cours ou en préparation..."
        }
    }

    if (!!iReply) interaction.reply(iReply);
}

module.exports = {
    active: true,
    family: "hexa",
    data: new SlashCommandBuilder()
        .setName(cmdProps.name)
        .setDescription("Commandes relatives aux saisons")
        // .setDefaultMemberPermissions((perms:Permissions))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('infos') // Alias s
                .setDescription('Afficher les infos de la saison en cours')
        )
    ,
    execute: handleSeasonsCmd,
    replyHandler: {}
}