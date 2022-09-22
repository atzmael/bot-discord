import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CreateMessageButton } from "@interactions/CreateMessageButton";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CustomButtonProps } from "@interfaces/extendDiscordJS";
import { addUser, FamiliesBase, findAllUsers, findFamilyBySlug, findUserById, updateUser } from "@models/Family";
import { createErrorLog } from "@models/Logs";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const handleFamilyCmd = async (interaction: CommandInteraction) => {
    // Display list of commandes for family

    // User lambda
    // OK f-join : Choix avec 3 boutons pour les 3 familles
    // OK f-leave : Quitte la famille actuelle et supprime toutes tes stats (faire une étape de confirmation)
    // OK f-family : infos de sa famille (à envoyer en mp ou voir si on peut cacher la réponse aux autres) >> nombre de membre, points totaux, rank
    // OK f-user : montre nos infos de contribution pendant la saison, le nombre de saisons jouées, ...

    if (!interaction.options) return;
    let iReply: any = "Aucune interaction detectée...";

    const subcmd = interaction.options.getSubcommand();

    // PUBLIC COMMANDS
    if ("join" === subcmd) {
        const family = interaction.options.getString("famille", true);
        let userFound = await findUserById(interaction.user.id);
        iReply = `Vous avez bien rejoint la famille ${FamiliesBase[family]}`;
        if (!!userFound && "" === userFound.family) {
            await updateUser(interaction.user.id, {
                family: family
            });
        } else if (!!userFound && "" !== userFound.family) {
            iReply = `Vous êtes déjà dans la famille : ${FamiliesBase[userFound.family!]}`;
        } else {
            await addUser({
                username: interaction.user.username,
                userID: interaction.user.id,
                rank: "0",
                points: 0,
                family: family
            })
            iReply = `Vous avez bien rejoint la famille ${FamiliesBase[family]}`;
        }
    } else if ("leave" === subcmd) {
        let userFound = await findUserById(interaction.user.id);
        if (!!userFound && "" !== userFound.family) {
            // Afficher message de confirmation avec la mention "ça vous fera perdre votre progression sur cette saison et ça retirera vos points de la famille"
            const btnConfirmLeave: CustomButtonProps = {
                customId: "btn_confirm_leave_f",
                label: "Confirmer",
                style: MessageButtonStyles.DANGER
            }
            const btn = CreateMessageButton(btnConfirmLeave);
            const row = CreateMessageRow([btn]);

            iReply = { content: "Êtes-vous sûr de vouloir quitter votre famille ? ça vous fera perdre votre progression sur cette saison mais n'affectera pas votre famille", components: [row] };
        } else {
            iReply = `Vous devez faire partie d'une famille pour utiliser cette commande.`;
        }
    } else if ("infos" === subcmd) {
        let userFound = await findUserById(interaction.user.id);
        if (!!userFound && "" !== userFound.family) {
            let fam = await findFamilyBySlug(userFound.family!);
            let fields = [];
            if (!!fam) {
                let contrib = userFound.points! * 100 / fam.points!;
                fields.push({ name: `Participe à la saison en cours`, value: '\u200b' });
                fields.push({ name: "Famille", value: fam.name!, inline: true });
                fields.push({ name: "Contribution dans la famille", value: `${contrib.toFixed(0).toString()}%`, inline: true });
                fields.push({ name: '\u200b', value: '\u200b' });
                fields.push({ name: "Rank", value: userFound.rank!, inline: true });
                fields.push({ name: "Points", value: userFound.points!.toString(), inline: true });
            }
            if (!!userFound.old_seasons && userFound.old_seasons.length > 0) {
                fields.push({ name: '\u200b', value: '\u200b' });
                fields.push({ name: "Saisons finies", value: userFound.old_seasons.length.toString() });
            }
            const embed = {
                title: userFound.username,
                fields: [
                    ...fields
                ]
            };
            iReply = { content: "_ _", embeds: [embed] };
        } else if (!userFound || "" === userFound.family) {
            iReply = `Vous devez avoir déjà participé à une saison pour utiliser cette commande.`;
        }
    } else if ("user" === subcmd) {
        let userFound = await findUserById(interaction.user.id);
        if (!!userFound) {
            let fam = await findFamilyBySlug(userFound.family!);
            let fields = [];
            if (!!fam) {
                let contrib = userFound.points! * 100 / fam.points!;
                fields.push({ name: "Famille", value: fam.name!, inline: true });
                fields.push({ name: "Contribution dans la famille", value: `${contrib.toFixed(0).toString()}%`, inline: true })
            }
            const embed = {
                title: userFound.username,
                fields: [
                    ...fields,
                    { name: '\u200b', value: '\u200b' },
                    { name: "Rank", value: userFound.rank!, inline: true },
                    { name: "Points", value: userFound.points!.toString(), inline: true },
                ]
            };
            iReply = { content: "_ _", embeds: [embed] };
        } else {
            iReply = `Vous devez avoir participer à une saison au moins une fois pour utiliser cette commande.`;
        }
    }

    interaction.reply(iReply);
}

const btnConfirmLeaveHandler = async (interaction: ButtonInteraction) => {
    let userFound = await findUserById(interaction.user.id);
    if (!!userFound) {
        await updateUser(interaction.user.id, {
            points: 0,
            rank: "0",
            family: ""
        });
        await interaction.reply({ content: `Vous êtes bien parti de votre famille` });
    } else {
        createErrorLog({ type: "btnConfirmLeaveHandler", error: "Utilisateur introuvable" });
    }
}

module.exports = {
    active: true,
    family: "hexa-f",
    data: new SlashCommandBuilder()
        .setName('hexa-family')
        .setDescription("Commandes relatives aux familles")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('join') // Alias j
                .setDescription('Rejoindre une famille')
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName('famille')
                        .setDescription("Choisissez une famille")
                        .setChoices({ name: FamiliesBase.famille_1, value: "famille_1" }, { name: FamiliesBase.famille_2, value: "famille_2" }, { name: FamiliesBase.famille_3, value: "famille_3" })
                        .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('leave')
                .setDescription('Quitter sa famille'))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('infos')
                .setDescription('Afficher les infos de sa famille'))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('user')
                .setDescription('Afficher nos infos'))
    ,
    execute: handleFamilyCmd,
    replyHandler: {
        btn_confirm_leave_f: btnConfirmLeaveHandler
    }
}