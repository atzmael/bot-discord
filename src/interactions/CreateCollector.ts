import { CustomCollectorOptions } from "@interfaces/extendDiscordJS";

export const CreateCollector = (props: CustomCollectorOptions) => {
    const { interaction, filter, duration = 6000 } = props;
    let filterFnc = (m: any) => true;
    if (filter) {
        filterFnc = (m: any) => m.content.includes(filter);
    }
    const collector = interaction.channel.createMessageCollector({ filterFnc, time: duration });
    return collector;
}

export const CreateMessageCollector = (interaction: any, reply: string, max = 1, time = 20000) => {
    return new Promise(async (res: (value: any) => void, rej: (reason: any) => void) => {
        let messageReply = null;
        const filter = (msg: any) => {
            return msg.author.id === interaction.user.id;
        };
        if (!!interaction.replied) {
            messageReply = await interaction.followUp(reply);
        } else {
            messageReply = await interaction.reply(reply);
        }
        try {
            let result = await interaction.channel!.awaitMessages({ filter, max, time });
            res({ result, messageReply });
        } catch (err: any) {
            rej(err)
        }
    })
}