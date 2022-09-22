import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { CustomClientProps } from "@interfaces/extendDiscordJS";
import vars from "@vars";
import { createActvity, findActivity, updateActivity } from '@models/Activity';
// import { createActvity, findActivity } from '@models/Activity';

export const onMessageReactionAdd = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: CustomClientProps) => {
    if (!client.botLoaded) return;
    if (!reaction.message.member) return; // Block command par mp ??? ne marche pas ?
    if (user.bot) return; // Block si c'est un bot qui fait une commande

    if (!!vars.trackers.emoji) {
        try {
            let userFound = await findActivity(user.id);
            if (!!userFound) {
                updateActivity(userFound.userID!, {
                    emojis: userFound.emojis! + 1,
                    weekly_emojis: userFound.weekly_emojis! + 1,
                    monthly_emojis: userFound.monthly_emojis! + 1,
                    yearly_emojis: userFound.yearly_emojis! + 1,
                    last_emoji_date: Date.now(),
                    current_week: userFound.current_week,
                    current_month: userFound.current_month,
                    current_year: userFound.current_year,
                }, "emoji")
            } else {
                createActvity({ userID: user.id, emojis: 1, last_emoji_date: Date.now(), type: "emoji" },);
            }
        } catch (err) {
            // TODO: error log
        }
    }

    /* let isAdmin = false;
    if (!!message.member) {
        isAdmin = !!message.member.roles.cache.get(process.env.ADMIN_ROLE_ID || '');
    }
    if (!isAdmin) {
        message.channel.send("Désolé, je ne réponds qu'à Geeckos...");
        return;
    } */
}