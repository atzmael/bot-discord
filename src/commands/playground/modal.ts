import { SlashCommandBuilder } from "@discordjs/builders";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CreateModal } from "@interactions/CreateModal";
import { CreateTextInput } from "@interactions/CreateTextInput";
import { CommandTypes } from "@interfaces/commandTypes";
import { CustomClientProps, CustomModalOptions } from "@interfaces/extendDiscordJS";
import { CommandInteraction, ModalSubmitInteraction, TextInputComponentOptions } from "discord.js";

const commandProps = {
    name: "modal",
    description: "Réponds en affichant une modal."
}

const execute = async (interaction: CommandInteraction, client: CustomClientProps) => {
    const textInputProps1: TextInputComponentOptions = {
        customId: "input_test_1",
        label: "Input test 1",
        style: "SHORT",
        minLength: 4,
        maxLength: 20,
        placeholder: "Coucou toi!",
        value: "Coucou"
    }
    const textInput1 = CreateTextInput(textInputProps1);

    const textInputProps2: TextInputComponentOptions = {
        customId: "input_test_2",
        label: "Input test 2",
        style: "PARAGRAPH",
        required: true,
        placeholder: "Placeholder test"
    }
    const textInput2 = CreateTextInput(textInputProps2);

    const row1: any = CreateMessageRow(textInput1);
    const row2: any = CreateMessageRow(textInput2);

    const modalProps: CustomModalOptions = {
        customId: "modal_test_1",
        title: "Modal test 1",
        components: [row1, row2]
    }

    const modal = CreateModal(modalProps);

    client.pendingModals.set(modal.customId, commandProps.name);

    await interaction.showModal(modal);
}

const modalTest1 = async (interaction: ModalSubmitInteraction) => {
    const { components } = interaction;
    const datas = [];

    for (let i = 0; i < components.length; i++) {
        datas.push(components[i].components[0].value);
    }
    await interaction.reply({ content: `Vos données : ${datas}` });
}

const Modal: CommandTypes = {
    active: false,
    family: "playground",
    data: new SlashCommandBuilder()
        .setName(commandProps.name)
        .setDescription(commandProps.description),
    execute,
    replyHandler: {
        modal_test_1: modalTest1
    }
}

module.exports = Modal;