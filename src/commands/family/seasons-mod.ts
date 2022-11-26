import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CreateMessageSelect } from "@interactions/CreateMessageSelect";
import { CreateModal } from "@interactions/CreateModal";
import { CreateTextInput } from "@interactions/CreateTextInput";
import { CustomClientProps, CustomModalOptions } from "@interfaces/extendDiscordJS";
import { addSeason, emptySeason, findAllSeasons, findSeasonBySlug, SeasonProps, SeasonStatus, SeasonStatusLabel, updateFamily, updateSeason } from "@models/Family";
import { sanitizeString, slugifyString } from "@utils/valueParsingUtils";
import { CommandInteraction, MessageSelectMenuOptions, ModalSubmitInteraction, SelectMenuInteraction, TextInputComponentOptions } from "discord.js";
import vars from "@vars";
import { checkRole } from "@utils/Authorization";

const cmdProps = {
    name: "hexa-smod",
    permissions: "0",
    rolesAuthorized: [...vars.globalAuthorizations.mod],
    channelsRestrictred: [],
}

let selectedSeason: SeasonProps = emptySeason;

const handleSeasonsModCmd = async (interaction: CommandInteraction, client: CustomClientProps) => {
    // Display list of commandes for seasons

    // Mod -> à mettre dans des commandes à part avec perms sur la modification de pseudo pour restreindre
    // OK fm-season create
    // fm-season set-status <status>

    if (!checkRole(cmdProps.rolesAuthorized, interaction.member!.roles)) {
        interaction.reply("Vous n'avez pas la permission pour effectuer cette commande.");
        return;
    }

    if (!interaction.options) return;
    let iReply: any = "Aucune interaction detectée...";

    const subcmd = interaction.options.getSubcommand();

    if ("create" === subcmd) {
        let currSeason = await findAllSeasons({ status: SeasonStatus.GOING });
        if (currSeason.length > 0) {
            iReply = "Il y a déjà une saison en cours !";
        } else {
            iReply = null;

            const inputSeasonName: TextInputComponentOptions = {
                customId: "input_season_name",
                label: "Nom de la saison",
                style: "SHORT",
                minLength: 4,
                maxLength: 20,
                required: true,
                placeholder: "Saison hiver #2"
            }
            const inputSeasonNameObject = CreateTextInput(inputSeasonName);

            const inputStartDate: TextInputComponentOptions = {
                customId: "input_start_date",
                label: "Date de début de la saison",
                style: "SHORT",
                minLength: 4,
                maxLength: 10,
                required: true,
                placeholder: "01/01/1970"
            }
            const inputStartDateObject = CreateTextInput(inputStartDate);

            const inputSeasonDuration: TextInputComponentOptions = {
                customId: "input_season_duration",
                label: "Durée de la saison en jours",
                style: "SHORT",
                required: true,
                placeholder: "30",
                minLength: 1,
                maxLength: 3
            }
            const inputSeasonDurationObject = CreateTextInput(inputSeasonDuration);

            const row1: any = CreateMessageRow(inputSeasonNameObject);
            const row2: any = CreateMessageRow(inputStartDateObject);
            const row3: any = CreateMessageRow(inputSeasonDurationObject);
            const modalProps: CustomModalOptions = {
                customId: "form_create_season",
                title: "Créer une nouvelle saison",
                // description: "Veuillez remplir tous les champs et faire attention au format de la date",
                components: [row1, row2, row3]
            }

            const modal = CreateModal(modalProps);
            client.pendingModals.set(modal.customId, cmdProps.name);
            await interaction.showModal(modal);
        }
    } else if ("set-status" === subcmd) {
        let allSeasons = await findAllSeasons();
        if (allSeasons.length > 0) {
            let filteredSeasons = allSeasons.filter((s: any) => s.status !== SeasonStatus.ARCHIVED);
            if (filteredSeasons.length > 0) {
                // TODO afficher 2 selects: 1 pour la saison à modifier, un pour le status à mettre
                let options = [];
                for (let i = 0; i < filteredSeasons.length; i++) {
                    options.push({
                        label: filteredSeasons[i].name!,
                        value: filteredSeasons[i].slug!
                    })
                }
                const selectSaisonProps: MessageSelectMenuOptions = {
                    customId: "select_saison",
                    placeholder: "Selectionner la saison",
                    minValues: 1,
                    maxValues: 1,
                    options: options
                }
                const selectSaison = CreateMessageSelect(selectSaisonProps);
                const row = CreateMessageRow([selectSaison]);

                iReply = { components: [row] };
            } else {
                iReply = "Il n'y a pas de saison disponible."
            }
        } else {
            iReply = "Il n'y a pas de saison disponible."
        }
    }

    if (!!iReply) interaction.reply(iReply);
}

const formCreateSeason = async (interaction: ModalSubmitInteraction) => {
    const { components } = interaction;
    let seasonData: SeasonProps = {
        name: "",
        slug: "",
        start_date: 0,
        end_date: 0,
        duration: 0
    }
    for (let i = 0; i < components.length; i++) {
        const row = components[i];
        for (let j = 0; j < row.components.length; j++) {
            const comp = row.components[j];
            if ("input_season_name" === comp.customId) {
                const d = new Date();
                let sanitizedName = sanitizeString(comp.value);
                let slugifiedName = `${slugifyString(sanitizedName)}_${d.getMonth() + 1}_${d.getFullYear()}`;
                seasonData.name = sanitizedName;
                seasonData.slug = slugifiedName;
            } else if ("input_start_date" === comp.customId) {
                if (!!comp.value.match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/gm)) {
                    const sd = comp.value.split('/');
                    const d = new Date(parseInt(sd[2]), parseInt(sd[1]), parseInt(sd[0]));
                    seasonData.start_date = d.getTime();
                }
            } else if ("input_season_duration" === comp.customId) {
                if (!!comp.value.match(/^[0-9]{1,3}$/gm)) {
                    const d = new Date(seasonData.start_date!);
                    d.setDate(d.getDate() + parseInt(comp.value));
                    seasonData.end_date = d.getTime();
                    seasonData.duration = parseInt(comp.value);
                }
            }
        }
    }
    addSeason(seasonData);

    await interaction.reply(`La saison "${seasonData.name}" a bien été créé`);
}

const selectSaisonResponse = async (interaction: SelectMenuInteraction) => {
    /* @ts-ignore */
    let season: SeasonProps = await findSeasonBySlug(interaction.values[0]);
    selectedSeason = season;
    if (!!selectedSeason) {

        let options = [];
        for (let i = 0; i < SeasonStatusLabel.length; i++) {
            options.push({
                label: SeasonStatusLabel[i],
                value: i.toString()
            })
        }
        const selectStatusProps: MessageSelectMenuOptions = {
            customId: "select_status",
            placeholder: "Selectionner le status",
            minValues: 1,
            maxValues: 1,
            options: options
        }
        const selectStatus = CreateMessageSelect(selectStatusProps);
        const row = CreateMessageRow([selectStatus]);

        await interaction.update({ content: `Saison selectionnée : ${selectedSeason.name}`, components: [row] })

    }
}

const selectStatusResponse = async (interaction: SelectMenuInteraction) => {
    await updateSeason(selectedSeason.slug!, {
        status: parseInt(interaction.values[0])
    })
    await interaction.update({ content: `La saison "${selectedSeason.name}" est maintenant **${SeasonStatusLabel[parseInt(interaction.values[0])]}**`, components: [] });
    selectedSeason = emptySeason;
}

module.exports = {
    active: true,
    family: "hexa",
    data: new SlashCommandBuilder()
        .setName(cmdProps.name)
        .setDescription("Commandes relatives aux saisons")
        .setDMPermission(false)
        .setDefaultMemberPermissions(cmdProps.permissions)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('create') // Alias s
                .setDescription('Modérateur uniquement. Créer une nouvelle saison')
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('set-status') // Alias s
                .setDescription("Modérateur uniquement. Change le status d'une saison")
        )
    ,
    execute: handleSeasonsModCmd,
    replyHandler: {
        form_create_season: formCreateSeason,
        select_saison: selectSaisonResponse,
        select_status: selectStatusResponse
    }
}