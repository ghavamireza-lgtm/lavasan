import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
    name: string;
    description: string;
    price: number;
    slug: string;
    durationDays: number;
    maxListings: number;
    featuredListings: number;
    features: string[];
    isActive: boolean;
    order: number;
}

const PlanSchema = new Schema<IPlan>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        durationDays: {
            type: Number,
            required: true,
            min: 1,
        },
        maxListings: {
            type: Number,
            required: true,
            min: 1,
        },
        featuredListings: {
            type: Number,
            default: 0,
            min: 0,
        },
        features: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);

export default Plan;