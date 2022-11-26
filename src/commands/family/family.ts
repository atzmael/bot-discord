import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CreateMessageButton } from "@interactions/CreateMessageButton";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { ICommandProps } from "@interfaces/commandTypes";
import { CustomButtonProps } from "@interfaces/extendDiscordJS";
import { addUser, FamiliesBase, findAllUsers, findFamilyBySlug, findUserById, updateUser } from "@models/Family";
import { createErrorLog } from "@models/Logs";
import { checkRole } from "@utils/Authorization";
import vars from "@vars";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const cmdProps: ICommandProps = {
    name: `hexa-${vars.text.entity_name}`,
    permissions: "0",
    rolesAuthorized: [...vars.globalAuthorizations.public, ...vars.globalAuthorizations.mod],
    channelsRestrictred: [],
}

const handleFamilyCmd = async (interaction: CommandInteraction) => {
    // Display list of commandes for family

    // User lambda
    // OK f-join : Choix avec 3 boutons pour les 3 familles
    // OK f-leave : Quitte la famille actuelle et supprime toutes tes stats (faire une étape de confirmation)
    // OK f-family : infos de sa famille (à envoyer en mp ou voir si on peut cacher la réponse aux autres) >> nombre de membre, points totaux, rank
    // OK f-user : montre nos infos de contribution pendant la saison, le nombre de saisons jouées, ...

    if (!checkRole(cmdProps.rolesAuthorized, interaction.member!.roles)) {
        interaction.reply("Vous n'avez pas la permission pour effectuer cette commande.");
        return;
    }

    if (!interaction.options) return;
    let iReply: any = "Aucune interaction detectée...";

    const { text } = vars;

    const subcmd = interaction.options.getSubcommand();

    // PUBLIC COMMANDS
    if ("join" === subcmd) {
        const family = interaction.options.getString(text.entity_name, true);
        let userFound = await findUserById(interaction.user.id);
        iReply = `Vous avez bien rejoint la ${text.entity_name} ${FamiliesBase[family]}`;
        if (!!userFound && "" === userFound.family) {
            await updateUser(interaction.user.id, {
                family: family
            });
        } else if (!!userFound && "" !== userFound.family) {
            iReply = `Vous êtes déjà dans la ${text.entity_name} : ${FamiliesBase[userFound.family!]}`;
        } else {
            await addUser({
                username: interaction.user.username,
                userID: interaction.user.id,
                rank: "0",
                points: 0,
                family: family
            })
            iReply = `Vous avez bien rejoint la ${text.entity_name} ${FamiliesBase[family]}`;
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

            iReply = { content: `Êtes-vous sûr de vouloir quitter votre ${text.entity_name} ? ça vous fera perdre votre progression sur cette saison mais n'affectera pas votre ${text.entity_name}`, components: [row] };
        } else {
            iReply = `Vous devez faire partie d'une ${text.entity_name} pour utiliser cette commande.`;
        }
    } else if ("infos" === subcmd) {
        let userFound = await findUserById(interaction.user.id);
        if (!!userFound && "" !== userFound.family) {
            let fam = await findFamilyBySlug(userFound.family!);
            let fields = [];
            if (!!fam) {
                let usersInFamily = await findAllUsers({ family: userFound.family });
                fields.push({ name: "Rank", value: fam.rank!, inline: true });
                fields.push({ name: "Points", value: fam.points!.toString(), inline: true });
                fields.push({ name: '\u200b', value: '\u200b' });
                fields.push({ name: "Membres", value: usersInFamily.length.toString(), inline: true });
                const embed = {
                    title: fam.name,
                    fields: [
                        ...fields
                    ]
                };
                iReply = { content: "_ _", embeds: [embed] };
            } else {
                iReply = `${text.entity_name.toUpperCase()} non trouvée : ${userFound.family!}, veuillez contacter un administrateur.`;
            }
        } else if (!userFound || "" === userFound.family) {
            iReply = `Vous devez participer à une saison pour utiliser cette commande.`;
        }
    } else if ("user" === subcmd) {
        let userFound = await findUserById(interaction.user.id);
        if (!!userFound) {
            let fam = await findFamilyBySlug(userFound.family!);
            let fields = [];
            if (!!fam) {
                let contrib = userFound.points! * 100 / fam.points!;
                fields.push({ name: text.entity_name.toUpperCase(), value: fam.name!, inline: true });
                fields.push({ name: `Contribution dans la ${text.entity_name}`, value: `${contrib.toFixed(0).toString()}%`, inline: true });
                fields.push({ name: '\u200b', value: '\u200b' });
                fields.push({ name: "Rank", value: userFound.rank!, inline: true });
                fields.push({ name: "Points", value: userFound.points!.toString(), inline: true });
            }
            if (!!userFound.old_seasons && userFound.old_seasons.length > 0) {
                fields.push({ name: "Saisons finies", value: userFound.old_seasons.length.toString() });
            }
            const embed = {
                title: userFound.username,
                fields: [
                    ...fields
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
        await interaction.reply({ content: `Vous êtes bien parti de votre ${vars.text.entity_name}` });
    } else {
        createErrorLog({ type: "btnConfirmLeaveHandler", error: "Utilisateur introuvable" });
    }
}

module.exports = {
    active: true,
    family: "hexa",
    data: new SlashCommandBuilder()
        .setName(cmdProps.name)
        .setDescription(`Commandes relatives aux ${vars.text.entity_name}s`)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('join') // Alias j
                .setDescription(`Rejoindre une ${vars.text.entity_name}`)
                .addStringOption((option: SlashCommandStringOption) =>
                    option
                        .setName(vars.text.entity_name)
                        .setDescription(`Choisissez une ${vars.text.entity_name}`)
                        .setChoices(
                            { name: vars.text.entity_1.name, value: vars.text.entity_1.slug },
                            { name: vars.text.entity_2.name, value: vars.text.entity_2.slug },
                            { name: vars.text.entity_3.name, value: vars.text.entity_3.slug })
                        .setRequired(true)))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('leave')
                .setDescription(`Quitter sa ${vars.text.entity_name}`))
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('infos')
                .setDescription(`Afficher les infos de sa ${vars.text.entity_name}`))
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