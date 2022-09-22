import { AutocompleteInteraction, Client, Collection, Intents, Interaction, Message, MessageReaction, PartialMessageReaction, PartialUser, ReactionEmoji, User } from 'discord.js';
import { onReady } from "@events/onReady";
import { onMessage } from "@events/onMessage";
import { CustomClientProps } from "@interfaces/extendDiscordJS";
import { onInteraction } from '@events/onInteraction';
import 'dotenv/config';
import { onMessageReactionAdd } from '@events/onMessageReactionAdd';

const init = () => {
    console.log("Starting discord bot...");

    const myIntents = new Intents();
    myIntents.add(Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS);
    const client: CustomClientProps = new Client({ intents: myIntents });

    client.botLoaded = false;
    client.commands = new Collection();
    client.pendingModals = new Collection();

    client.once('ready', onReady);
    client.on('messageCreate', (message: Message) => { onMessage(message, client) });
    client.on('messageReactionAdd', (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => { onMessageReactionAdd(reaction, user, client) });
    client.on('interactionCreate', (interaction: Interaction) => onInteraction(interaction, client));

    client.login(process.env.TOKEN);
}

init();