import { CustomModalOptions } from "@interfaces/extendDiscordJS";
import { Modal } from "discord.js";

export const CreateModal = (props: CustomModalOptions) => {
    const { customId, title, components } = props;

    const modal = new Modal();
    if (!!customId) {
        modal.setCustomId(customId);
    }
    if (!!title) {
        modal.setTitle(title);
    }
    if (components.length > 0) {
        for (let i = 0; i < components.length; i++) {
            modal.addComponents(components[i])
        }
    }

    return modal;
}