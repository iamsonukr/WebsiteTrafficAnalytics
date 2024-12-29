import mongoose from "mongoose";

const visitorLiteSchema = new mongoose.Schema({
    Subject:String,
    timestamp: Date,
    url: String,
    referrer: String,
    language: String
});

export const VisitorLiteModel = mongoose.model('VisitorLite', visitorLiteSchema);