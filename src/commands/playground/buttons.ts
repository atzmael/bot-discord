import { SlashCommandBuilder } from "@discordjs/builders";
import { CreateMessageButton } from "@interactions/CreateMessageButton";
import { CreateMessageRow } from "@interactions/CreateMessageRow";
import { CommandTypes } from "@interfaces/commandTypes";
import { CustomButtonProps } from "@interfaces/extendDiscordJS";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const execute = async (interaction: CommandInteraction) => {
    const buttonProps1: CustomButtonProps = {
        customId: "button_test_1",
        label: "Bouton test 1",
        style: MessageButtonStyles.PRIMARY
    }
    const button1 = CreateMessageButton(buttonProps1);

    const buttonProps2: CustomButtonProps = {
        customId: "button_test_2",
        label: "Bouton test 2",
        style: MessageButtonStyles.PRIMARY
    }
    const button2 = CreateMessageButton(buttonProps2);

    const row = CreateMessageRow([button1, button2]);

    await interaction.reply({ components: [row] });
}

const buttonTest1 = async (interaction: ButtonInteraction) => {
    await interaction.reply({ content: `Bonjour ${interaction.user.username}` });
}

const Buttons: CommandTypes = {
    active: false,
    family: "playground",
    data: new SlashCommandBuilder()
        .setName('buttons')
        .setDescription("Réponds en affichant des boutons."),
    execute,
    replyHandler: {
        button_test_1: buttonTest1
    }
}

module.exports = Buttons;