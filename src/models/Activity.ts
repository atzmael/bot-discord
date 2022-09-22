import { getWeekNumber } from "@utils/DateUtils";
import mongoose from "mongoose";
import { createErrorLog } from "./Logs";

// TODO : give access to user own stats

interface DataProps {
    userID?: string;
    messages?: Number;
    weekly_messages?: Number;
    monthly_messages?: Number;
    yearly_messages?: Number;
    last_message_date?: Number;
    emojis?: Number;
    weekly_emojis?: Number;
    monthly_emojis?: Number;
    yearly_emojis?: Number;
    last_emoji_date?: Number;
    voices?: Number;
    weekly_voices?: Number;
    monthly_voices?: Number;
    yearly_voices?: Number;
    last_voice_date?: Number;
    current_week?: Number;
    current_month?: Number;
    current_year?: Number;
    type?: "message" | "emoji" | "voice";
}

// Twitch activity : https://dev.twitch.tv/docs/eventsub - prendre ses points d'activité en achetant une récompense twitch
const ActivitySchema = new mongoose.Schema({
    userID: String,
    messages: Number,
    weekly_messages: Number,
    monthly_messages: Number,
    yearly_messages: Number,
    last_message_date: Number,
    emojis: Number,
    weekly_emojis: Number,
    monthly_emojis: Number,
    yearly_emojis: Number,
    last_emoji_date: Number,
    voices: Number,
    weekly_voices: Number,
    monthly_voices: Number,
    yearly_voices: Number,
    last_voice_date: Number,
    current_week: Number,
    current_month: Number,
    current_year: Number,
})

const ActivityModel = mongoose.model('trackers_activities', ActivitySchema, 'trackers_activities');

export const createActvity = async ({ userID,
    messages = 0, voices = 0, emojis = 0,
    last_emoji_date = 0, last_message_date = 0, last_voice_date = 0,
    weekly_messages = 0, monthly_messages = 0, yearly_messages = 0,
    weekly_emojis = 0, monthly_emojis = 0, yearly_emojis = 0,
    weekly_voices = 0, monthly_voices = 0, yearly_voices = 0,
    current_week = 0, current_month = 0, current_year = 0,
    type
}: DataProps) => {
    const d = new Date();
    const month = d.getMonth();
    const week = getWeekNumber(d);
    const year = d.getFullYear();

    if (type === "message") {
        weekly_messages = 1;
        monthly_messages = 1;
        yearly_messages = 1;
    } else if (type === "emoji") {
        weekly_emojis = 1;
        monthly_emojis = 1;
        yearly_emojis = 1;
    } else if (type === "voice") {
        weekly_voices = 1; // à voir comment calculer
        monthly_voices = 1;
        yearly_voices = 1;
    }

    await new ActivityModel({
        userID,
        messages,
        weekly_messages,
        monthly_messages,
        yearly_messages,
        last_message_date,
        emojis,
        weekly_emojis,
        monthly_emojis,
        yearly_emojis,
        last_emoji_date,
        voices,
        weekly_voices,
        monthly_voices,
        yearly_voices,
        last_voice_date,
        current_week: week,
        current_month: month,
        current_year: year,
    }).save();
}

export const findActivity = async (userID: string) => {
    let act = ActivityModel.findOne({ userID: userID }).clone();
    return act;
}

export const updateActivity = async (userID: string, data: DataProps, type: "message" | "emoji" | "voice") => {
    const d = new Date();
    const month = d.getMonth() + 1;
    const week = getWeekNumber(d);
    const year = d.getFullYear();

    if (year > data.current_year!) {
        data.current_year = year;
        data.current_month = month;
        data.current_week = week;
        if (type === "message") {
            data.yearly_messages = 1;
            data.yearly_emojis = 0;
            data.yearly_voices = 0;
            data.monthly_messages = 1;
            data.monthly_emojis = 0;
            data.monthly_voices = 0;
            data.weekly_messages = 1;
            data.weekly_emojis = 0;
            data.weekly_voices = 0;
        } else if (type === "emoji") {
            data.yearly_messages = 0;
            data.yearly_emojis = 1;
            data.yearly_voices = 0;
            data.monthly_messages = 0;
            data.monthly_emojis = 1;
            data.monthly_voices = 0;
            data.weekly_messages = 0;
            data.weekly_emojis = 1;
            data.weekly_voices = 0;
        } else if (type === "voice") {
            data.yearly_messages = 0;
            data.yearly_emojis = 0;
            data.yearly_voices = 1; // à voir comment calculer
            data.monthly_messages = 0;
            data.monthly_emojis = 0;
            data.monthly_voices = 1; // à voir comment calculer
            data.weekly_messages = 0;
            data.weekly_emojis = 0;
            data.weekly_voices = 1; // à voir comment calculer
        }
    } else if (month > data.current_month!) {
        data.current_month = month;
        data.current_week = week;
        if (type === "message") {
            data.monthly_messages = 1;
            data.monthly_emojis = 0;
            data.monthly_voices = 0;
            data.weekly_messages = 1;
            data.weekly_emojis = 0;
            data.weekly_voices = 0;
        } else if (type === "emoji") {
            data.monthly_messages = 0;
            data.monthly_emojis = 1;
            data.monthly_voices = 0;
            data.weekly_messages = 0;
            data.weekly_emojis = 1;
            data.weekly_voices = 0;
        } else if (type === "voice") {
            data.monthly_messages = 0;
            data.monthly_emojis = 0;
            data.monthly_voices = 1; // à voir comment calculer
            data.weekly_messages = 0;
            data.weekly_emojis = 0;
            data.weekly_voices = 1; // à voir comment calculer
        }
    } else if (week > data.current_week!) {
        data.current_week = week;
        if (type === "message") {
            data.weekly_messages = 1;
            data.weekly_emojis = 0;
            data.weekly_voices = 0;
        } else if (type === "emoji") {
            data.weekly_messages = 0;
            data.weekly_emojis = 1;
            data.weekly_voices = 0;
        } else if (type === "voice") {
            data.weekly_messages = 0;
            data.weekly_emojis = 0;
            data.weekly_voices = 1; // à voir comment calculer
        }
    }

    await ActivityModel.updateOne({ userID: userID }, data, async (err: any, res: any) => {
        createErrorLog({ type: "trackers_activities:update", error: err });
    }).clone();
}