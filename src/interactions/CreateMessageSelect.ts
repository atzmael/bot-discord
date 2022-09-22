import { MessageSelectMenu, MessageSelectMenuOptions } from "discord.js";

export const CreateMessageSelect = (props: MessageSelectMenuOptions) => {
    const selectMenu = new MessageSelectMenu();

    const { customId, placeholder, options, disabled, minValues, maxValues } = props;

    if (!!customId) {
        selectMenu.setCustomId(customId);
    }
    if (!!placeholder) {
        selectMenu.setPlaceholder(placeholder);
    }
    if (!!options && options.length > 0) {
        selectMenu.addOptions(options);
    }
    if (!!disabled) {
        selectMenu.setDisabled(disabled);
    }
    if (!!minValues) {
        selectMenu.setMinValues(minValues);
    }
    if (!!maxValues) {
        selectMenu.setMaxValues(maxValues);
    }

    return selectMenu;
}