import mongoose from "mongoose";
import { createErrorLog } from "./Logs";

// games_fam_users

interface UserStats {
    season_name: string;
    season_id: string;
    rank: string;
    points: number;
    contrib: number;
    family: string;
}

export interface UserProps {
    username?: string,
    userID?: string;
    points?: number;
    rank?: string;
    family?: string;
    old_seasons?: Array<UserStats>
}

const UserSchema = new mongoose.Schema({
    username: String,
    userID: String,
    points: Number,
    rank: String,
    family: String,
    old_seasons: Array,
})

const UserModel = mongoose.model('games_fam_users', UserSchema, 'games_fam_users');

export const FamiliesBase: { [key: string]: string } = {
    "explorateur_1": "Explorateur",
    "looter_2": "Looter",
    "crafteur_3": "Crafteur",
}

export const findUserById = async (userID: string) => {
    let user = UserModel.findOne({ userID: userID }).clone();
    return user;
}

export const findAllUsers = async (filters?: any) => {
    let users = UserModel.find(filters).clone();
    return users;
}

export const updateUser = async (userID: string, data: UserProps) => {
    await UserModel.updateOne({ userID: userID }, data, (err: any, res: any) => {
        createErrorLog({ type: "games_fam_users:update", error: err });
    }).clone();
}

export const addUser = async (data: UserProps) => {
    await new UserModel({
        ...data
    }).save();
}

// games_fam_families

interface FamilyProps {
    slug?: string;
    name?: string;
    points?: number;
    rank?: string;
}

const FamilySchema = new mongoose.Schema({
    slug: String,
    name: String,
    points: Number,
    rank: String
})

const FamilyModel = mongoose.model('games_fam_families', FamilySchema, 'games_fam_families');

export const findFamilyBySlug = async (slug: string) => {
    let act = FamilyModel.findOne({ slug: slug }).clone();
    return act;
}

export const findAllFamilies = async () => {
    let fams = FamilyModel.find().clone();
    return fams;
}

export const updateFamily = async (slug: string, data: FamilyProps) => {
    await FamilyModel.updateOne({ slug: slug }, data, (err: any, res: any) => {
        createErrorLog({ type: "games_fam_families:update", error: err });
    }).clone();
}

export const sortFamilies = async () => {
    let families = await findAllFamilies();
    families.sort((a: any, b: any) => b.points - a.points);
    for (let i = 0; i < families.length; i++) {
        await updateFamily(families[i].slug!, {
            rank: (i + 1).toString()
        })
    }
}

// games_fam_seasons

export const emptySeason: SeasonProps = {
    name: "",
    slug: "",
    status: 0,
    start_date: 0,
    end_date: 0,
    duration: 0,
    leader: "",
    finalTotalPoints: 0,
    finalRanking: new Array<FamilyProps>,
    users: new Array<UserProps>
}

export interface SeasonProps {
    slug?: string;
    name?: string;
    status?: SeasonStatus;
    start_date?: number;
    end_date?: number;
    duration?: number;
    leader?: string;
    finalTotalPoints?: number;
    finalRanking?: Array<FamilyProps>;
    users?: Array<UserProps>;
}

export enum SeasonStatus {
    PREPARING,
    GOING,
    PAUSED,
    ENDED,
    ARCHIVED,
}

export const SeasonStatusLabel = [
    "En préparation",
    "En cours",
    "En pause",
    "Terminée",
    "Archivée"
]

const SeasonSchema = new mongoose.Schema({
    slug: String,
    name: String,
    status: Number,
    start_date: Number,
    end_date: Number,
    leader: String,
    finalTotalPoints: Number,
    finalRanking: Array<FamilyProps>,
    duration: Number,
    users: Array<UserProps>
})

const SeasonModel = mongoose.model('games_fam_seasons', SeasonSchema, 'games_fam_seasons');

export const findSeasonBySlug = async (slug: string) => {
    let season = SeasonModel.findOne({ slug: slug }).clone();
    return season;
}

export const findAllSeasons = async (filters?: any) => {
    let seasons = SeasonModel.find(filters).clone();
    return seasons;
}

export const updateSeason = async (slug: string, data: SeasonProps) => {
    await SeasonModel.updateOne({ slug: slug }, data, (err: any, res: any) => {
        createErrorLog({ type: "games_fam_seasons:update", error: err });
    }).clone();
}

export const addSeason = async (data: SeasonProps) => {
    await new SeasonModel({
        ...data,
        status: SeasonStatus.PREPARING,
        leader: ""
    }).save();
}


// Utils