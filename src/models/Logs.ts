import mongoose from "mongoose";

interface DataProps {
    type: string;
    error: string
    created_date?: number;
}

const ErrorLogSchema = new mongoose.Schema({
    type: String,
    error: String,
    created_date: Number,
})

const ErrorLogModel = mongoose.model('logs_errors', ErrorLogSchema, 'logs_errors');

export const createErrorLog = async ({ type, error }: DataProps) => {
    await new ErrorLogModel({
        type,
        created_date: Date.now(),
        error
    }).save();
}