import { MessageActionRow, MessageButton, MessageSelectMenu, TextInputComponent } from "discord.js";

export const CreateMessageRow = (components: any | TextInputComponent | Array<MessageButton | MessageSelectMenu>) => {
    const row = new MessageActionRow()
        .addComponents(components);
    return row;
}