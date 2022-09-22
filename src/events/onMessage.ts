import { Message } from 'discord.js';
import { CustomClientProps } from "@interfaces/extendDiscordJS";
import vars from "@vars";
import { createActvity, findActivity, updateActivity } from '@models/Activity';
// import { createActvity, findActivity } from '@models/Activity';

export const onMessage = async (message: Message, client: CustomClientProps) => {
    if (!client.botLoaded) return;
    if (!message.member) return; // Block command par mp ??? ne marche pas ?
    if (message.author.bot) return; // Block si c'est un bot qui fait une commande

    if (!!vars.trackers.msg) {
        try {
            let userFound = await findActivity(message.author.id);
            if (!!userFound) {
                updateActivity(userFound.userID!, {
                    messages: userFound.messages! + 1,
                    weekly_messages: userFound.weekly_messages! + 1,
                    monthly_messages: userFound.monthly_messages! + 1,
                    yearly_messages: userFound.yearly_messages! + 1,
                    last_message_date: message.createdTimestamp,
                    current_week: userFound.current_week,
                    current_month: userFound.current_month,
                    current_year: userFound.current_year,
                }, "message")
            } else {
                createActvity({ userID: message.author.id, messages: 1, last_message_date: message.createdTimestamp, type: "message" });
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