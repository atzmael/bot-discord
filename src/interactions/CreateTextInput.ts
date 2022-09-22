import { TextInputComponent, TextInputComponentOptions } from "discord.js";

export const CreateTextInput = (props: TextInputComponentOptions) => {
    const { customId, label, style, required, placeholder, value, minLength, maxLength } = props;

    const input = new TextInputComponent();

    if (!!customId) {
        input.setCustomId(customId);
    }
    if (!!label) {
        input.setLabel(label);
    }
    if (!!style) {
        input.setStyle(style);
    }
    if (!!required) {
        input.setRequired(required);
    }
    if (!!placeholder) {
        input.setPlaceholder(placeholder);
    }
    if (!!value) {
        input.setValue(value);
    }
    if (!!minLength) {
        input.setMinLength(minLength);
    }
    if (!!maxLength) {
        input.setMaxLength(maxLength);
    }

    return input;
}
