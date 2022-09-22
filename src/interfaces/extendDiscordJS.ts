import { BaseButtonOptions, Client, Collection, MessageActionRow, TextInputComponent } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { CommandTypes } from './commandTypes';

export interface CustomClientProps extends Client {
    commands?: any;
    botLoaded?: boolean;
    pendingModals?: any;
}

export interface CustomButtonProps extends BaseButtonOptions {
    style: MessageButtonStyles;
    customId?: string;
    url?: string;
}

export interface CustomModalOptions {
    customId: string;
    title: string;
    components: Array<MessageActionRow<TextInputComponent>>
}

export interface CustomCollectorOptions {
    interaction: any;
    filter?: any;
    duration?: number;
}