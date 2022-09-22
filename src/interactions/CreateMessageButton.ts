import { BaseButtonOptions, InteractionButtonOptions, LinkButtonOptions, MessageButton } from "discord.js";
import { CustomButtonProps } from "@interfaces/extendDiscordJS";

export const CreateMessageButton = (props: CustomButtonProps) => {
    const { customId, label, style, disabled, emoji, url } = props;
    const button = new MessageButton();
    if (!!customId) {
        button.setCustomId(customId);
    }
    if (!!label) {
        button.setLabel(label);
    }
    if (!!style) {
        button.setStyle(style);
    }
    if (!!disabled) {
        button.setDisabled(disabled);
    }
    if (!!emoji) {
        // TODO
        console.log("Button got emoji", emoji);
        // button.setEmoji(emoji);
    }
    if (!!url) {
        button.setURL(url);
    }

    return button;
}