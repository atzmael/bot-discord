import { SlashCommandBuilder } from "@discordjs/builders";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CreateMessageSelect } from "@interactions/CreateMessageSelect";
import { CommandTypes } from "@interfaces/commandTypes";
import { CommandInteraction, MessageSelectMenuOptions, SelectMenuInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const execute = async (interaction: CommandInteraction) => {
    const selectProps: MessageSelectMenuOptions = {
        customId: "select_test_1",
        placeholder: "Selectionner les options",
        minValues: 2,
        maxValues: 4,
        options: [
            {
                label: "Value 1",
                value: "1"
            },
            {
                label: "Value 2",
                value: "2"
            },
            {
                label: "Value 3",
                value: "3"
            },
            {
                label: "Value 4",
                value: "4"
            },
            {
                label: "Value 5",
                value: "5"
            },
        ]
    }
    const select = CreateMessageSelect(selectProps);
    const row = CreateMessageRow([select]);

    await interaction.reply({ components: [row] });
}

const selectTest1 = async (interaction: SelectMenuInteraction) => {
    await interaction.reply({ content: `Vous avez choisi : ${interaction.values}` });
}

const Select: CommandTypes = {
    active: true,
    family: "playground",
    data: new SlashCommandBuilder()
        .setName('select')
        .setDescription("Réponds en affichant un menu déroulant."),
    execute,
    replyHandler: {
        select_test_1: selectTest1
    }
}

module.exports = Select;