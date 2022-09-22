import { EmbedBuilder, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CreateMessageCollector } from "@interactions/CreateCollector";
import { CreateMessageButton } from "@interactions/CreateMessageButton";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CustomButtonProps } from "@interfaces/extendDiscordJS";
import { findFamilyBySlug, findUserById } from "@models/Family";
import { getFirstGroup } from "@utils/valueParsingUtils";
import { ButtonInteraction, CommandInteraction, MessageComponentInteraction, MessageInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const cmdProps = {
    name: "hexa-fmod",
    permissions: "0",
}

const handleFamilyModCmd = async (interaction: CommandInteraction) => {
    // Display list of commandes for family

    // Mod -> à mettre dans des commandes à part avec perms sur la modification de pseudo pour restreindre
    // fm-user p-add|p-remove|p-set <membre> : contrôle les points d'une utilisateur
    // fm-family p-add|p-remove|p-set <family> : contrôle les points d'une famille

    // Points en fonction des activités
    // fm-activity msg|vc|emojis|twitch : récupère les données d'activités des utilisateurs (trackers_activity)
    // Donner des points suivants le classement d'activité et non en fonction du nombre de message > éviter les spams message pour avoir pleins de points

    if (!interaction.options) return;
    let iReply: any = "Aucune interaction detectée...";

    const subcmd = interaction.options.getSubcommand();

    // PUBLIC COMMANDS
    if ("user" === subcmd) {
        const btnUserPtsAdd: CustomButtonProps = {
            customId: "btn_user_pts_add",
            label: "Ajout de points",
            style: MessageButtonStyles.PRIMARY
        }
        const btn2 = CreateMessageButton(btnUserPtsAdd);

        const btnUserPtsRemove: CustomButtonProps = {
            customId: "btn_user_pts_remove",
            label: "Retrait de points",
            style: MessageButtonStyles.PRIMARY
        }
        const btn3 = CreateMessageButton(btnUserPtsRemove);

        const btnUserPtsSet: CustomButtonProps = {
            customId: "btn_user_pts_set",
            label: "Définir les points",
            style: MessageButtonStyles.PRIMARY
        }
        const btn4 = CreateMessageButton(btnUserPtsSet);

        const row = CreateMessageRow([btn2, btn3, btn4]);

        iReply = { content: "Choisissez une option", components: [row] };

    } else if ("activity" === subcmd) {

    } else if ("user-info" === subcmd) {
        let user = interaction.options.getUser("mention", true);
        if (!user) return;
        let userFound = await findUserById(user.id);
        if (!!userFound) {
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
        } else {
            iReply = { content: `L'utilisateur n'a jamais participé à une saison.` };
        }
    }

    interaction.reply(iReply);
}

/* const waitForUserMessage = (interaction: any) => {
    return new Promise(async (res: (value: any) => void, rej: (reason: any) => void) => {
        let collection = await CreateMessageCollector(interaction, `Mentionner l'utilisateur à gérer`);
        if (collection.size === 0) {
            waitForUserMessage(interaction);
        } else {
            res(collection);
        }
    })
} */

const waitForUserMessage = (interaction: any, reply: string) => {
    return new Promise(async (res: (value: any) => void, rej: (reason: any) => void) => {
        let { result, messageReply } = await CreateMessageCollector(interaction, reply);
        if (result.size === 0) {
            interaction.followUp("Trop lent gamin, recommence ! *(T'as eu 20s abuses pas)*");
            rej(null);
        } else {
            res({ clt: result, msgr: messageReply })
        }
    })
}

const btnUserPtsAdd = async (interaction: ButtonInteraction) => {
    let userToHandleID = null;
    let ptsToAdd = null;

    let userIdCollection: { clt: any, msgr: any } = await waitForUserMessage(interaction, `Mentionner l'utilisateur à gérer`);
    if (!userIdCollection) return;
    let userIdMessage = userIdCollection.clt.first();
    let userIdMatchArray = getFirstGroup(/^<@([0-9]+)>$/gm, userIdMessage.content);
    if (userIdMatchArray.length === 1) {
        userToHandleID = userIdMatchArray[0];
    } else {
        userIdMessage.delete();
        userIdCollection.msgr.edit("On a dit de mentionner l'utilisateur, pas de faire sa liste de course !");
    }

    let ptsCollection: { clt: any, msgr: any } = await waitForUserMessage(interaction, `Indique le nombre de points à ajouter à cet utilisateur`);
    if (!ptsCollection) return;
    let ptsMessage = ptsCollection.clt.first();
    let ptsMatchArray = ptsMessage.content.match(/^[0-9]+$/gm);
    if (ptsMatchArray.length === 1) {
        ptsToAdd = ptsMatchArray[0];
    } else {
        ptsMessage.delete();
        // TODO: choper le followUp pour le changer et non changer la réponse de base ici !
        ptsCollection.msgr.edit("On a dit de donner un nombre, pas de faire sa liste de course !");
    }
    if (!!userToHandleID && !!ptsToAdd) {
        console.log("GIVE HIM HIS POINTS");
    }
}

const btnUserPtsRemove = async (interaction: ButtonInteraction) => {

}

const btnUserPtsSet = async (interaction: ButtonInteraction) => {

}

module.exports = {
    active: true,
    family: "hexa",
    data: new SlashCommandBuilder()
        .setName(cmdProps.name)
        .setDescription("Commandes de modération relatives aux familles")
        .setDMPermission(false)
        .setDefaultMemberPermissions(cmdProps.permissions)
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('user')
                .setDescription('gérer un utilisateur')
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('user-info')
                .setDescription('avoir les informations d\'un utilisateur')
                .addUserOption((option: SlashCommandUserOption) =>
                    option
                        .setName("mention")
                        .setDescription("Mention de l'utilisateur")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('activity')
                .setDescription('Récupère les données d\'activité des utilisateurs')
        )
    ,
    execute: handleFamilyModCmd,
    replyHandler: {
        btn_user_pts_add: btnUserPtsAdd,
        btn_user_pts_remove: btnUserPtsRemove,
        btn_user_pts_set: btnUserPtsSet
    }
}